const Reservation = require('../models/Reservation');

(async () => {
  try {
    const existing = await Reservation.findOne({ where: { userId: 1, id_trip: 3 } });
    console.log(existing);
  } catch (err) {
    console.error('Erreur lors de la recherche de réservation :', err);
  }
})();

