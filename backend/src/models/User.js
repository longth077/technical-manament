const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    defaultValue: '',
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    defaultValue: '',
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: '',
  },
  fullName: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  role: {
    type: DataTypes.STRING(20),
    defaultValue: 'user',
  },
}, {
  tableName: 'users',
  underscored: true,
  defaultScope: {
    attributes: { exclude: ['password'] },
  },
  scopes: {
    withPassword: {
      attributes: {},
    },
  },
});

module.exports = User;
