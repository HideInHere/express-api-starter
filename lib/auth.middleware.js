const jwt = require('jsonwebtoken');
const { UnauthorizedError, ForbiddenError } = require('../errors');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return next(new UnauthorizedError('Missing auth token'));
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

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('User not authenticated'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError(`Requires one of: ${roles.join(', ')}`));
    }

    next();
  };
};

const rateLimitByUser = (store) => {
  return (req, res, next) => {
    const key = `rate:${req.user?.id || req.ip}`;
    store.incr(key, (err, count) => {
      if (err) return next(err);
      
      if (count === 1) {
        store.expire(key, 60);
      }
      
      if (count > 100) {
        return next(new ForbiddenError('Rate limit exceeded'));
      }
      
      next();
    });
  };
};

module.exports = { verifyToken, requireRole, rateLimitByUser };