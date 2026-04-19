const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TechEquipment = sequelize.define('TechEquipment', {
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
  repair: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  operatingHours: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
}, {
  tableName: 'tech_equipment',
  underscored: true,
});

module.exports = TechEquipment;
