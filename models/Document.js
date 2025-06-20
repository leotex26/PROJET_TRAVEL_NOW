const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM(
      "carte_d'identité",
      'passeport',
      'carnet_de_santé',
      'visa',
      'autorisation_parentale',
      'justificatif_domicile'
    ),
    allowNull: false,
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date_upload: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
    isValidate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false  
  }
}, {
  timestamps: true,
  tableName: 'documents',
});

Document.associate = (models) => {
  Document.belongsTo(models.User, { foreignKey: 'userId', as: 'utilisateur' });
};

module.exports = Document;
