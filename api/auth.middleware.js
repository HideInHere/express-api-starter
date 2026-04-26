const jwt = require('jsonwebtoken');
const { UnauthorizedError, ForbiddenError } = require('../errors');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(new UnauthorizedError('No token provided'));
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

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('User not authenticated'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ForbiddenError(`Requires one of: ${roles.join(', ')}`)
      );
    }

    next();
  };
};

const rateLimitByUser = (req, res, next) => {
  const key = `rate:${req.user?.id || req.ip}`;
  const count = req.app.locals.cache?.get(key) || 0;

  if (count > 100) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  req.app.locals.cache?.set(key, count + 1, 'EX', 60);
  next();
};

module.exports = {
  verifyToken,
  requireRole,
  rateLimitByUser,
};