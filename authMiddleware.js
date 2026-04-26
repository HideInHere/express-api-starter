const jwt = require('jsonwebtoken');
const { UnauthorizedError, ForbiddenError } = require('./errors');

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
      return next(new ForbiddenError(`Required role: ${roles.join(', ')}`));
    }

    next();
  };
};

const rateLimitByUser = (store) => {
  return (req, res, next) => {
    const key = `${req.user?.id || req.ip}`;
    const limit = 100;
    const window = 3600;

    store.increment(key, (err, count) => {
      if (err) return next(err);

      if (count === 1) {
        store.expire(key, window);
      }

      if (count > limit) {
        res.set('Retry-After', window);
        return next(new Error('Rate limit exceeded'));
      }

      next();
    });
  };
};

module.exports = {
  verifyToken,
  requireRole,
  rateLimitByUser,
};