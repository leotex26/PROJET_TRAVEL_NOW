const { body } = require('express-validator');

exports.validateTrip = [
  body('lieux').notEmpty().withMessage('Le lieu est requis'),
  body('dateDeb').isISO8601().toDate().withMessage('Date de début invalide'),
  body('dateFin').isISO8601().toDate().withMessage('Date de fin invalide'),
  body('nb_de_places')
    .isInt({ gt: 0 })
    .withMessage("Le nombre de places doit être supérieur à 0"),


];
