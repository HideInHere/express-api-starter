const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors');

module.exports = (options = {}) => {
  const { secret = process.env.JWT_SECRET, algorithms = ['HS256'] } = options;

  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(new UnauthorizedError('Missing token'));
    }

    try {
      const decoded = jwt.verify(token, secret, { algorithms });
      req.user = decoded;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(new UnauthorizedError('Token expired'));
      }
      next(new UnauthorizedError('Invalid token'));
    }
  };
};

# filename: validate.middleware.js

const { ValidationError } = require('../errors');

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const messages = error.details.reduce((acc, err) => {
      acc[err.path[0]] = err.message;
      return acc;
    }, {});
    return next(new ValidationError('Validation failed', messages));
  }

  req.validated = value;
  next();
};

module.exports = validate;

# filename: users.routes.js

const express = require('express');
const authMiddleware = require('./auth.middleware');
const validate = require('./validate.middleware');
const { createUserSchema, updateUserSchema } = require('./schemas');
const UsersController = require('./users.controller');

const router = express.Router();
const controller = new UsersController();

router.post('/', validate(createUserSchema), (req, res, next) =>
  controller.create(req.validated).then(user => res.status(201).json(user)).catch(next)
);

router.get('/:id', authMiddleware(), (req, res, next) =>
  controller.getById(req.params.id).then(user => res.json(user)).catch(next)
);

router.patch('/:id', authMiddleware(), validate(updateUserSchema), (req, res, next) =>
  controller.update(req.params.id,