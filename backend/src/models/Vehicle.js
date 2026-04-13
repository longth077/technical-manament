const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehicle = sequelize.define('Vehicle', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  classification: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  brand: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  vehicleType: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  country: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  year: {
    type: DataTypes.STRING(20),
    defaultValue: '',
  },
  assignedUnit: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  assignedIndividual: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  repair: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  operatingHours: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  km: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
}, {
  tableName: 'vehicles',
  underscored: true,
});

module.exports = Vehicle;
