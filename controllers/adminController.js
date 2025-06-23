
const Payment = require('../models/Payment');
const Reservation = require('../models/Reservation');
const User = require('../models/User');
const Trip = require('../models/Trip');
const { Op } = require('sequelize');

  

  exports.dashboard = async (req, res) => {
    const trips = await Trip.findAll({
      where: {
        statut: 'DISPONIBLE'
      }
    });



    const reservations = await Reservation.findAll({
      where: {
        id_trip: { [Op.in]: trips.map(trip => trip.id) }
      }
    });

    const stats = trips.map(trip => {
        const inscrits = reservations.filter(res => res.id_trip === trip.id).length;
        const lieux = trip.lieux;
        const dates = trip.dateDeb + ' - ' + trip.dateFin;
        return {
          lieux,
          dates,
          inscrits
        };
      });
  
    res.render('dashboard', { stats, titre: 'Dashboard' });
  };
  
