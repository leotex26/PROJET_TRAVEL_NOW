const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middlewares/auth');
const isAuthenticated = require('../middlewares/isAuthenticated');
const isAdmin = require('../middlewares/requireAdmin');
const { validatePayment } = require('../validator/paymentValidator');
const validate = require('../middlewares/validationResult');

// Membre
router.get('/:registrationId', isAuthenticated, paymentController.simulatePaymentPage); // page
router.post('/:registrationId', isAuthenticated, validatePayment, validate,  paymentController.simulatePayment); // submit
router.get('/me', isAuthenticated, paymentController.getMyPayments);

// Admin
router.get('/trip/:id', isAdmin, paymentController.getPaymentsByTrip);

module.exports = router;
