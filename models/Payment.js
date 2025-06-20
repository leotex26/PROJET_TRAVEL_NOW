const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Reservation = require('./Reservation');

const Payment = sequelize.define('Payment', {
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  payment_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('acompte', 'total'),
    allowNull: false
  }
});

// Relations (optionnelles selon ton usage)
Payment.belongsTo(User, { foreignKey: 'id_user' });
Payment.belongsTo(Reservation, { foreignKey: 'id_registration' });

module.exports = Payment;
