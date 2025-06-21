const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const requireAdmin = require('../middlewares/requireAdmin');
const { validateTrip } = require('../validator/tripValidator');
const validate = require('../middlewares/validationResult');





// =============================


router.get('/', tripController.getAllTripsAvailable); // afficher tous les voyages disponibles sur la page d'accueil
router.get('/form', requireAdmin, tripController.getTripForm); // l'admin peut acceder au formulaire de creation d'un voyage
router.get('/:id', tripController.getTripDetails); // afficher les détails d'un voyage
router.post('/', validateTrip, validate, requireAdmin, tripController.createTrip); // soumettre le formulaire de creation d'un voyage
router.get('/:id/edit', requireAdmin, tripController.editTripForm); // afficher le formulaire de modification d'un voyage pour l'admin
router.patch('/:id/cancel', requireAdmin, tripController.cancelTripController); // annuler un voyage
router.patch('/:id/rerun', requireAdmin, tripController.rerunTripController); // relancer un voyage
router.put('/:id', requireAdmin, tripController.updateTrip); // modifier un voyage
router.delete('/:id', requireAdmin, tripController.deleteTrip); // supprimer un voyage

router.get('/updateAll', tripController.updateStatusTrip); // mettre à jour le statut des voyages



module.exports = router;
