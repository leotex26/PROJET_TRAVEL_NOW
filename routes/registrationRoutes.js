const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const isAuthenticated = require('../middlewares/isAuthenticated');
const { validateReservation } = require('../validator/reservationValidator');
const validate = require('../middlewares/validationResult');



router.post('/:tripId' , isAuthenticated, validateReservation, validate, registrationController.registrationToATrip); // inscription
router.get('/me', isAuthenticated, registrationController.getMyRegistrations); // voir toutes les inscriptions du current user
router.delete('/:tripId', isAuthenticated ,  registrationController.deleteRegistrationToATrip);
router.get('/trip/:id', isAuthenticated, registrationController.getRegistrationsForTrip); // 

module.exports = router;