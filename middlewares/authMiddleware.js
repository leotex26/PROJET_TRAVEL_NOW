const jwt = require('jsonwebtoken');

// verif
exports.authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.locals.isAuthenticated = false;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.isAuthenticated = true;
    res.locals.userId = decoded.id;
  } catch {
    res.clearCookie('token');
    res.locals.isAuthenticated = false;
  }

  next();
};
