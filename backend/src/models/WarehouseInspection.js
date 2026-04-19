const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WarehouseInspection = sequelize.define('WarehouseInspection', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  warehouseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  inspectorName: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  inspectorPosition: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  content: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  evaluation: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  requirements: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  serverName: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
}, {
  tableName: 'warehouse_inspections',
  underscored: true,
});

module.exports = WarehouseInspection;
