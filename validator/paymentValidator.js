const { body } = require('express-validator');

exports.validatePayment = [
  body('amount')
    .isFloat({ gt: 0 })
    .withMessage("Le montant doit être un nombre positif"),

  body('status')
    .isIn(['acompte', 'total'])
    .withMessage("Le statut doit être 'acompte' ou 'total'"),
];
