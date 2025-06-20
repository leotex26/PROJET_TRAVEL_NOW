module.exports = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).render('index', { message: 'Accès interdit' ,
      titre : 'Erreur'
    });
  }
  next();
};