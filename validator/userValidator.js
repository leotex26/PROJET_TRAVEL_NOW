const { body } = require('express-validator');

exports.validateUser = [
  body('username')
    .notEmpty().withMessage('Le nom d utilisateur est requis')
    .isLength({ min: 4 }).withMessage('doit contenir au moins 4 caractères'),

  body('email')
  .notEmpty().withMessage('Le nom d utilisateur est requis')
    .isEmail().withMessage('doit etre un email'),
  body('password')
  .notEmpty().withMessage('Le nom d utilisateur est requis')
    .isArray({ min: 1 }).withMessage('Il faut au moins un ingrédient'),
];


