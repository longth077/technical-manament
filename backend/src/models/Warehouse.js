const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Warehouse = sequelize.define('Warehouse', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  functionDesc: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  keeper: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  managingUnit: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  area: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  constructionDate: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  notes: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
}, {
  tableName: 'warehouses',
  underscored: true,
});

module.exports = Warehouse;
