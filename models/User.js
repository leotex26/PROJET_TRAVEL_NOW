const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
      type: DataTypes.STRING,
      defaultValue: 'user', 
  }
  
}, {
  timestamps: true, 
  tableName: 'users'
});

if (process.env.NODE_ENV !== 'test') {
  User.hasMany(require('./Document'), { foreignKey: 'userId', as: 'documents' });
}


module.exports = User;
