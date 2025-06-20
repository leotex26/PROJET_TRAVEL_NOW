const { body } = require('express-validator');

exports.validateReservation = [
  body('prix')
    .isFloat({ gt: 0 })
    .withMessage("Le prix doit être un nombre positif"),

  body('statut')
    .isIn([
      'réservé',
      'dossier_incomplet',
      'en_attente_de_validation',
      'validé',
      'acompte_payé',
      'en_cours',
      'voyage_effectué',
      'clôturé'
    ])
    .withMessage("Statut invalide"),
];
