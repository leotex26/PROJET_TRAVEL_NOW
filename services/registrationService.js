const  Registration  = require('../models/Reservation');
const { checkUserDocuments } = require('../services/documentService');


exports.addInscriptionToTrip = async (user, trip) => {
  if (!user) {
    throw new Error('Utilisateur non authentifié.');
  }

  if (!trip) {
    throw new Error('Voyage introuvable.');
  }

const dateDeb = new Date(trip.dateDeb);
const dateFin = new Date(trip.dateFin);

const diffTime = Math.abs(dateFin - dateDeb); 
const nbDeJours = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Vérifie si l'utilisateur est déjà inscrit
  const existing = await Registration.findOne({
    where: {
      userId: user.id,
      id_trip: trip.id
    }
  });

  if (existing) {
    throw new Error('Déjà inscrit à ce voyage.');
  }

  // Vérifie les documents requis
  const requiredDocs = trip.type_doc_requis;
  const docCheck = await checkUserDocuments(user.id, requiredDocs, 365);

  if (!docCheck.isValid) {
    const reasons = [];
    if (docCheck.missingTypes.length > 0)
      reasons.push(`Documents manquants : ${docCheck.missingTypes.join(', ')}`);
    if (docCheck.expiredTypes.length > 0)
      reasons.push(`Documents expirés : ${docCheck.expiredTypes.join(', ')}`);
    
    throw new Error('Documents non valides. ' + reasons.join('. '));
  }

  if (trip.statut !== 'DISPONIBLE') {
    throw new Error('Ce voyage n’est pas disponible.');
  }

  // Tout est bon, on crée l'inscription
  const registration = await Registration.create({
    prix : 97*nbDeJours,
    userId: user.id, 
    id_trip: trip.id, 
    status: 'réservé'
  });

  if(trip.nb_de_places <= 0){
    trip.statut = 'COMPLET';
  }else{
    trip.nb_de_places --;
    console.log('les places partent')
    await trip.save();
  }

  return registration;
};



