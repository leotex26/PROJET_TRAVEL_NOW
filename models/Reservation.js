const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 
const User = require('./User'); 
const Trip = require('./Trip');

const Reservation = sequelize.define('Reservation', {
  prix: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  statut: {
    type: DataTypes.ENUM(
  'réservé',                    // l'utilisateur a réservé une place
  'dossier_incomplet',          // réservation faite mais documents manquants
  'en_attente_de_validation',   // tous les documents sont soumis, en cours de vérification
  'validé',                     // documents validés, dossier prêt
  'acompte_payé',               // acompte versé, mais départ pas encore effectué
  'en_cours',
  'voyage_effectué',            // voyage terminé
  'clôturé',                    // voyage terminé ET paiement final validé

),
    defaultValue: 'réservé',
  },
  documents_ok: {
    type: DataTypes.BOOLEAN,
    defaultValue: 'false',
  },

}, {
  tableName: 'reservations',
  timestamps: true,
});

// Associations 
User.hasMany(Reservation, { foreignKey: 'userId' });
Reservation.belongsTo(User, { foreignKey: 'userId' });

Trip.hasMany(Reservation, { foreignKey: 'id_trip' });
Reservation.belongsTo(Trip, { foreignKey: 'id_trip' });

module.exports = Reservation;
