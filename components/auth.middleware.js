const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(new UnauthorizedError('Missing token'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Token expired'));
    }
    next(new UnauthorizedError('Invalid token'));
  }
};

const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    req.user = null;
  }
  next();
};

const requireRole = (allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError('Authentication required'));
  }

  if (!allowedRoles.includes(req.user.role)) {
    return next(new UnauthorizedError('Insufficient permissions'));
  }

  next();
};

module.exports = { verifyToken, optionalAuth, requireRole };