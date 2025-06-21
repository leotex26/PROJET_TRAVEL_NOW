const { param } = require('express-validator');

exports.validateReservation = [
  param('tripId')
    .isInt({ gt: 0 })
    .withMessage("L'identifiant du voyage est invalide"),
];