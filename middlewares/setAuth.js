const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const token = req.cookies.token;
  console.log('Token:', token);

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      if (user) {
        req.user = user;
        res.locals.currentUser = user;
        res.locals.isAuthenticated = true;
        res.locals.isAdmin = false;
        console.log('authentifié !!! ');
        if (user.role === 'admin'){
          res.locals.isAdmin = true;
          console.log('admin');
        }
        console.log('User found:', user.username);
      } else {
        res.locals.currentUser = null;
        res.locals.isAuthenticated = false;
        console.log('User not found in DB');
      }
    } catch (err) {
      res.locals.currentUser = null;
      res.locals.isAuthenticated = false;
      console.log('Token verification error:', err.message);
    }
  } else {
    res.locals.currentUser = null;
    res.locals.isAuthenticated = false;
    console.log('No token found');
  }

  next();
};
