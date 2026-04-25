const jwt = require('jsonwebtoken');
const { UnauthorizedError, ForbiddenError } = require('../errors/AppError');

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

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('User not authenticated'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError(`Required roles: ${allowedRoles.join(', ')}`));
    }

    next();
  };
};

const rateLimitByUser = (req, res, next) => {
  const key = `ratelimit:${req.user?.id || req.ip}`;
  const limit = req.user?.id ? 100 : 10;
  
  req.redis.incr(key, (err, count) => {
    if (count === 1) {
      req.redis.expire(key, 3600);
    }
    
    if (count > limit) {
      return next(new ForbiddenError('Rate limit exceeded'));
    }
    
    next();
  });
};

module.exports = { verifyToken, requireRole, rateLimitByUser };