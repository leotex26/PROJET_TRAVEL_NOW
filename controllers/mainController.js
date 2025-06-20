const Trip = require('../models/Trip');
const tripController = require('../controllers/tripController');
const tripService = require('../services/tripService');


exports.getPageTripsAvailable = async (req, res) => {
  try {
    const trips = await tripService.fetchAvailableTrips(); // renvoie tout les trips finallement

    res.render('index', {
      titre : 'TravelNow',
      titreA: 'Voyages disponibles',
      titreB: 'Autres voyages',
      trips,
      currentUser: res.locals.currentUser || null,
      isAuthenticated: res.locals.isAuthenticated || false,
      isAdmin : res.locals.isAdmin || null
    });

  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Erreur lors du chargement des voyages.' });
  }
};

