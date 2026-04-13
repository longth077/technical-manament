const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Weapon = sequelize.define('Weapon', {
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
  unitMeasure: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  quantity: {
    type: DataTypes.STRING(50),
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
}, {
  tableName: 'weapons',
  underscored: true,
});

module.exports = Weapon;
