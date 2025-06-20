const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 
const { type } = require('os');

const Trip = sequelize.define('Trip', {
  lieux: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateDeb: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  dateFin: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  nb_de_places: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  statut: {
    type: DataTypes.ENUM('ANNULÉ','DISPONIBLE', 'COMPLET', 'EN_COURS', 'FINIT'),
    allowNull: false,
    defaultValue: 'à venir',
  },
  type_doc_requis: {
    type: DataTypes.JSON, // tableau JSON, ex: ['passeport', 'visa']
    allowNull: false,
    defaultValue: []
  }
}, {
  tableName: 'trips',
  timestamps: true,
});

module.exports = Trip;
