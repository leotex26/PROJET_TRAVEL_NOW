const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/isAuthenticated');
const upload = require('../middlewares/upload');
const userController = require('../controllers/userController'); 
const requireAdmin = require('../middlewares/requireAdmin');



router.get('/auth/signup', userController.registerPage); // form enregistrement d'un compte
router.post('/auth/signup',  userController.register); // submit de ce formulaire de register
router.get('/auth/login', userController.loginPage); // form login
router.post('/auth/login', userController.login); // submit du login
router.get('/profile', isAuthenticated, userController.getProfile);
router.post('/profile', isAuthenticated, userController.updateProfile);
router.post('/profile/upload', isAuthenticated, upload.single('document'), userController.uploadDocsProfil);
router.delete('/profile/documents/:id', userController.deleteDocument);
//router.get('/allProfile', isAuthenticated, requireAdmin, userController.PageGestionAdmin) 
router.get('/auth/logout', userController.logout);


module.exports = router;
