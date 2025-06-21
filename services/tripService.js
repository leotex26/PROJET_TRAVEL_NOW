const Trip = require('../models/Trip');

/**
 * Récupère tous les voyages disponibles
 * @returns 
 */
exports.fetchAvailableTrips = async () => {
  return await Trip.findAll({
    //where: { statut: 'DISPONIBLE' },
    order: [['dateDeb', 'ASC']]
  });
};

/**
 * annuler un voyage
 * @param {} trip 
 * @returns 
 */
exports.cancelTripStatus = async (trip) => {
  
  if (trip.statut === 'ANNULÉ') {
    throw new Error('Le voyage est déjà annulé.');
  }

  if (trip.statut === 'FINIT') {
    throw new Error('Le voyage est déjà terminé.');
  }

  trip.statut = 'ANNULÉ';
  await trip.save();
  return 'Le voyage a été annulé avec succès.';
};

/**
 * relancer un voyage
 * @param {} trip 
 * @returns 
 */
exports.rerunTripStatus = async (trip) => {
  if (trip.statut !== 'ANNULÉ') {
    throw new Error('Le voyage n\'est pas annulé.');
  }

  const now = new Date();
  const dateDeb = new Date(trip.dateDeb);
  const dateFin = new Date(trip.dateFin);

  if (now < dateDeb) {
    trip.statut = trip.nb_de_places > 0 ? 'DISPONIBLE' : 'COMPLET';
  } else if (now >= dateDeb && now <= dateFin) {
    trip.statut = 'EN_COURS';
  } else {
    throw new Error('Le voyage est déjà terminé, impossible de le réactiver.');
  }

  await trip.save();
  return `Le voyage a été réactivé avec le statut : ${trip.statut}`;
};

/**
 * mettre à jour le statut des voyages
 * @returns 
 */
exports.updateTripsStatut  = async() => {
  const today = new Date();

  Trip.findAll()
    .then(trips => {
      const updates = trips.map(trip => {
        let newStatut = trip.statut;

        if (trip.statut === 'ANNULÉ') {
          return null; // ne pas toucher aux voyages annulés
        }

        if (today < trip.dateDeb) {
          newStatut = 'DISPONIBLE';
        } else if (today >= trip.dateDeb && today <= trip.dateFin) {
          newStatut = 'EN COURS';
        } else if (today > trip.dateFin) {
          newStatut = 'TERMINÉ';
        }

        if (newStatut !== trip.statut) {
          trip.statut = newStatut;
          return trip.save();
        } else {
          return null;
        }
      });

      return Promise.all(updates.filter(Boolean));
    })
    .then(results => {
      console.log(`Statuts mis à jour pour ${results.length} voyages.`);
    })
    .catch(err => {
      console.error("Erreur lors de la mise à jour des statuts :", err);
    });
}