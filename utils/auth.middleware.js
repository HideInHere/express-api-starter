const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors');

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

const refreshToken = (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new UnauthorizedError('Refresh token required'));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    next(new UnauthorizedError('Invalid refresh token'));
  }
};

module.exports = { verifyToken, refreshToken };