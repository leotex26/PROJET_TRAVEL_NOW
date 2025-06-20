const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const tripController = require('../controllers/tripController');
const auth = require('../middlewares/auth');
const isAuthenticated = require('../middlewares/isAuthenticated');
const upload = require('../middlewares/upload'); 
const isAdmin = require('../middlewares/requireAdmin'); 
const { validateDocument } = require('../validator/documentValidator');
const validate = require('../middlewares/validationResult');





// avoir tout les types de doc
router.get('/', documentController.getAllRequiredDocumentTypes);




// Membre -------------------------------------------------------------------------------------------------------------
// submit un doc avec photo, depend du currentUser
router.post('/:registrationId', isAuthenticated, upload.single('document'), validateDocument ,validate ,documentController.submitDocument);
// consulter doc du currentUser
router.get('/me', isAuthenticated, documentController.getMyDocuments);





// Admin -------------------------------------------------------------------------------------------------------------
// voir les documents pour un voyage
router.get('/trip/:id', isAuthenticated, isAdmin, documentController.getDocumentsByTrip);

// mettre un nouveau type de document à un voyage
router.post('/:id/:type', isAdmin,validateDocument, tripController.addRequiredDocument);

// Affiche la liste des utilisateurs et leurs documents 
router.get('/users', isAuthenticated, isAdmin, documentController.showUsersDocuments);

// Affiche la page pour valider un document
router.get('/validate/:id', isAuthenticated, isAdmin, documentController.showValidateDocumentForm);

// Valide un document (modification en base)
//router.post('/validate/:id',  documentController.validateDocument);




module.exports = router;
