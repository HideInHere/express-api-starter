const jwt = require('jsonwebtoken');
const { UnauthorizedError, ForbiddenError } = require('../errors');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing or invalid authorization header'));
  }

  const token = authHeader.slice(7);

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

const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError('User not authenticated'));
  }

  if (!allowedRoles.includes(req.user.role)) {
    return next(new ForbiddenError(`Role ${req.user.role} not permitted`));
  }

  next();
};

const refreshToken = (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new UnauthorizedError('Refresh token required'));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newToken = jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    res.json({ token: newToken });
  } catch {
    next(new UnauthorizedError('Invalid refresh token'));
  }
};

module.exports = { verifyToken, requireRole, refreshToken };