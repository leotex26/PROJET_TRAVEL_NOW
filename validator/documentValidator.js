const { body } = require('express-validator');

exports.validateDocument = [
  body('type')
    .isIn([
      "carte_d'identité",
      'passeport',
      'carnet_de_santé',
      'visa',
      'autorisation_parentale',
      'justificatif_domicile'
    ])
    .withMessage("Type de document invalide"),
];
