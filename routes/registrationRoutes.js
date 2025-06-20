const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const auth = require('../middlewares/auth');
const isAuthenticated = require('../middlewares/isAuthenticated');


router.post('/:tripId' , isAuthenticated,  registrationController.registrationToATrip); // inscription
router.get('/me', isAuthenticated, registrationController.getMyRegistrations); // voir toutes les inscriptions du current user
router.delete('/:tripId', isAuthenticated ,  registrationController.deleteRegistrationToATrip);
router.get('/:tripId', isAuthenticated ,  registrationController.deleteRegistrationToATrip);
router.get('/trip/:id', isAuthenticated, registrationController.getRegistrationsForTrip);

module.exports = router;