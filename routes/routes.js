const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');
const documentController = require('../controllers/documentController');
const adminController = require('../controllers/adminController');
const isAdmin = require('../middlewares/requireAdmin');

// Page d’accueil avec les trips disponibles
router.get('/', mainController.getPageTripsAvailable);


// cette route ne fonctionne pas dans DocumentsRoutes, c'est pour ça qu'elle est là


router.post('/api/documents/validate/:id',  documentController.validateDocument);
router.get('/admin/dashboard', isAdmin, adminController.dashboard);

module.exports = router;