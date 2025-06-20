const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const requireAdmin = require('../middlewares/requireAdmin');
const { validateTrip } = require('../validator/tripValidator');
const validate = require('../middlewares/validationResult');





// =============================


router.get('/', tripController.getAllTripsAvailable);
router.get('/form', requireAdmin, tripController.getTripForm);
router.get('/:id', tripController.getTripDetails);
router.post('/', validateTrip, validate, requireAdmin, tripController.createTrip);
router.get('/:id/edit', requireAdmin, tripController.editTripForm);
router.patch('/:id/cancel', requireAdmin, tripController.cancelTripController); //
router.patch('/:id/rerun', requireAdmin, tripController.rerunTripController); // 
router.put('/:id', requireAdmin, tripController.updateTrip);
router.delete('/:id',  tripController.deleteTrip);

router.get('/updateAll', tripController.updateStatusTrip)



module.exports = router;
