const Reservation = require('../models/Reservation');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Trip = require('../models/Trip');
const Registration = require('../models/Reservation');
const { checkUserDocuments } = require('../services/documentService');
const registrationService = require('../services/registrationService');

/**
 * enregistre l'utilisateur courant authentifié dans une reservation pour un voyage
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.registrationToATrip = async (req, res) => {
  try {
    const user = req.user;
    const tripId = req.params.tripId;

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non authentifié.' });
    }

    const trip = await Trip.findByPk(tripId);

    if (!trip) {
      return res.status(404).json({ message: 'Voyage non trouvé.' });
    }

    // Appel du service centralisé
    const registration = await registrationService.addInscriptionToTrip(user, trip);

    return res.status(201).json({
      message: 'Inscription réussie.',
      registration
    });

  } catch (err) {
    console.error('Erreur lors de l’inscription :', err.message);

    // Gestion des cas personnalisés renvoyés par le service
    if (err.type === 'DOCUMENTS') {
      return res.status(400).json({
        message: err.message,
        manquants: err.missingTypes,
        expirés: err.expiredTypes
      });
    }

    // Erreur générique
    return res.status(400).json({ message: err.message || 'Erreur lors de l’inscription.' });
  }
};

/**
 * Récupère les inscriptions (registrations) de l'utilisateur connecté
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getMyRegistrations = async (req,res) =>{
try {
    const user = req.user; 

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non authentifié.' });
    }

    const registrations = await Reservation.findAll({
      where: { userId: req.user.id },
            include: [
        {
          model: Trip,
          attributes: ['lieux', 'dateDeb', 'dateFin'] 
        }
      ],
      order: [['updatedAt', 'DESC']]
    });


    res.status(200).render('userRegistrations', { registrations ,
      titre : 'Mes réservations'
    });

  } catch (err) {
    console.error('Erreur lors de la récupération des inscriptions :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

/**
 * supprime une reservation
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.deleteRegistrationToATrip = async (req, res) => {
   try {
    const user = req.user; 
    const tripId = req.params.tripId;

    // verif user auth
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non authentifié.' });
    }

    // Vérifie si le voyage existe
    const trip = await Trip.findByPk(tripId);

    if (!trip) {
      return res.status(404).json({ message: 'Voyage non trouvé.' });
    }

    const registration = await Registration.findOne({
      where: {
        id_membre: user.id,
        id_trip: trip.id
      }
    });

    if (!registration) {
      return res.status(404).json({ message: 'Réservation non trouvée.' });
    }

    await registration.destroy();

    return res.status(200).json({ message: 'Réservation annulée avec succès.' });

  } catch (e) {
    console.error('Erreur lors de l’annulation de la réservation :', e);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};


/**
 * rend toutes les reservations d'une voyages
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getRegistrationsForTrip = async (req, res) => {
  try {
    const user = res.locals.currentUser;

    // Vérifie que l'utilisateur est authentifié et admin
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé. Réservé aux administrateurs.' });
    }

    const tripId = req.params.id;

    const trip = await Trip.findByPk(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Voyage non trouvé.' });
    }

    const registrations = await Registration.findAll({
      where: { id_trip: tripId },
      include: [{ model: User, attributes: ['id', 'username', 'email'] }]
    });

    return res.status(200).json({
      voyage: {
        id: trip.id,
        titre: trip.titre,
        date: trip.date
      },
      inscriptions: registrations
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des inscriptions :', error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};