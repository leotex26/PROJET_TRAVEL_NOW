const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Non authentifié' });
  }
  next();
};

module.exports = isAuthenticated;
