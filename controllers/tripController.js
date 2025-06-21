const Reservation = require('../models/Reservation');
const Trip = require('../models/Trip');
const tripService = require('../services/tripService')

/**
 * Affiche tous les voyages
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllTrips = async (req, res) => {
  const trips = await Trip.findAll();
  res.render('trips/index', { trips });
};

/**
 * Affiche tous les voyages disponibles sur la page d'accueil
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllTripsAvailable = async (req, res) => {
  try {
    const availableTrips = await Trip.findAll({
      //where: { statut: 'DISPONIBLE' }
    });

    res.render({ trips: availableTrips }); 
  } catch (err) {
    console.error('Erreur lors de la récupération des voyages disponibles :', err);
    res.status(500).send('Erreur serveur');
  }
};

/**
 * Affiche les détails d'un voyage
 * @param {*} req 
 * @param {*} res 
 */
exports.getTripDetails = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    const user = req.user;

    let alreadyRegistered = false;

    const reservations = await Reservation.findAll();

    const reservationsA = reservations.filter(
      (resa) => resa.userId === user.id && resa.id_trip === trip.id
    );

    alreadyRegistered = reservationsA.length > 0;

    res.render('trips/tripDetails', {
      trip: trip,
      titre: trip.titre,
      user: user,
      alreadyRegistered
    });
  } catch (err) {
    console.error('Erreur lors de la récupération du voyage :', err);
    res.status(500).send('Erreur serveur');
  }
};



/**
 * Affiche le formulaire de création d'un voyage
 * @param {*} req 
 * @param {*} res 
 */
exports.getTripForm = (req, res) => {
  try {
    //console.log('getTripForm démarre');

    const trip = Trip.build(); // Crée une instance vide du modèle Trip

    res.render('trips/new', {
      trip,
      titre: 'Créer un nouveau voyage'
    });
  } catch (err) {
    console.error('Erreur dans getTripForm :', err);
    res.status(500).send('Erreur serveur');
  }
};

/**
 * Créer un voyage
 */
exports.createTrip = async (req, res) => {
  try {
    const data = req.body;

    // Normalise type_doc_requis pour qu'il soit toujours un tableau
    if (!Array.isArray(data.type_doc_requis)) {
      data.type_doc_requis = [data.type_doc_requis];
    }

    data.statut = 'DISPONIBLE';

    //console.log('Création trip avec:', data);

    await Trip.create(data);
    res.redirect('/');
  } catch (err) {
    console.error('Erreur création voyage:', err);
    res.status(500).send('Erreur création voyage');
  }
};

/**
 * Affiche le formulaire de modification d'un voyage
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.editTripForm = async (req, res) => {
  const trip = await Trip.findByPk(req.params.id);
  if (!trip) return res.status(404).send('Voyage non trouvé');
  res.render('trips/editTrip', { trip ,
    titre : "Modifier Voyage"
  });
};

/**
 * Modifier un voyage
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.updateTrip = async (req, res) => {
  const trip = await Trip.findByPk(req.params.id);
  if (!trip) return res.status(404).send('Voyage non trouvé');
  await trip.update(req.body);
  res.redirect('/');
};

/**
 * Supprimer un voyage
 * @param {} req 
 * @param {*} res 
 * @returns 
 */
exports.deleteTrip = async (req, res) => {
  const trip = await Trip.findByPk(req.params.id);
  if (!trip) return res.status(404).send('Voyage non trouvé');
  await trip.destroy();
  res.status(200).json({ message: 'Voyage supprimé' });
};

/**
 * Ajouter un document requis à un voyage
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.addRequiredDocument = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    if (!trip) return res.status(404).send('Voyage non trouvé');

    const newDocument = req.params.type;

    const allowedDocs = [
      "carte_d'identité",
      'passeport',
      'carnet_de_santé',
      'visa',
      'autorisation_parentale',
      'justificatif_domicile'
    ];

    if (!newDocument) {
      return res.status(400).send('Aucun document fourni');
    }

    if (!allowedDocs.includes(newDocument)) {
      return res.status(400).send('Document non valide');
    }

    trip.type_doc_requis = trip.type_doc_requis || [];

    if (!trip.type_doc_requis.includes(newDocument)) {
      trip.type_doc_requis.push(newDocument);
      await trip.save();
    }

    res.status(200).json({ message: 'Document requis ajouté avec succès', documents: trip.type_doc_requis });
  } catch (err) {
    console.error('Erreur lors de l’ajout du document requis :', err);
    res.status(500).send('Erreur serveur');
  }
};

/**
 * Annuler un voyage
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.cancelTripController = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id); 

    if (!trip) {
      return res.status(404).send('Voyage non trouvé');
    }

    await tripService.cancelTripStatus(trip); 
    res.redirect('/'); 

  } catch (err) {
    console.error('Erreur :', err.message);
    res.status(400).send(err.message);
  }
};

/**
 * Relancer un voyage
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.rerunTripController = async (req, res) => {
try{
  const trip = await Trip.findByPk(req.params.id); 

  if (!trip) {
      return res.status(404).send('Voyage non trouvé');
    }

  await tripService.rerunTripStatus(trip);
  res.redirect('/'); 

}catch (err){
    console.error('Erreur :', err.message);
    res.status(400).send(err.message);
}
};

/**
 * Mettre à jour le statut des voyages
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.updateStatusTrip  = async (req, res) => {

await tripService.updateTripsStatut();

};

