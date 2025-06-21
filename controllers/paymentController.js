const { Model } = require('sequelize');
const Payment = require('../models/Payment');
const Reservation = require('../models/Reservation');
const Trip = require('../models/Trip');
const User = require('../models/User');


/**
 * Affiche la page de paiement
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.simulatePaymentPage = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non authentifié.' });
    }

    const reservation = await Reservation.findByPk(req.params.registrationId, {
      include: [{
        model: Trip,
        attributes: ['lieux', 'dateDeb', 'dateFin']
      }],
    });

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation introuvable.' });
    }

    const trip = reservation.Trip;

    res.status(200).render('acompte', {
      reservation,
      trip,
      titre: 'Paiement de mon acompte'
    });

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};



  
// POST /api/payments/:registrationId
exports.simulatePayment = async (req, res) => {
  const user = req.user;
  const { registrationId } = req.params;

  try {
    const registration = await Reservation.findByPk(registrationId);

    if (!registration) {
      return res.status(404).json({ message: "Réservation non trouvée." });
    }

    // Vérification : l'utilisateur est bien le propriétaire
    if (registration.userId !== user.id) {
      return res.status(403).json({ message: "Accès interdit." });
    }

    // Vérification : déjà payé ?
    if (registration.statut === 'acompte_payé' || registration.statut === 'en_cours') {
      return res.status(400).json({ message: "Acompte déjà réglé." });
    }

    const amount = registration.prix * 0.2;

    // Enregistrement du paiement
    const payment = await Payment.create({
      id_user: user.id,
      id_registration: registrationId,
      amount: amount,
      status: 'acompte'
    });

    // Mise à jour du statut de réservation
    registration.statut = 'acompte_payé';
    await registration.save();

return res.redirect('/api/registrations/me');


  } catch (e) {
    console.error("Erreur paiement :", e);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// GET /api/payments/me
exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { id_user: req.user.id },
      include: [{ model: Reservation }]
    });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// GET /api/payments/trip/:id
exports.getPaymentsByTrip = async (req, res) => {
  try {
    const tripId = req.params.id;

    const registrations = await Reservation.findAll({ where: { id_trip: tripId } });
    const registrationIds = registrations.map(r => r.id);

    const payments = await Payment.findAll({
      where: {
        id_registration: registrationIds
      },
      include: [
        { model: User, attributes: ['username', 'email'] },
        { model: Reservation }
      ]
    });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
