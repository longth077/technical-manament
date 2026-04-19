const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WarehouseAccess = sequelize.define('WarehouseAccess', {
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
  visitorName: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  companionCount: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  unit: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  responsiblePerson: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  timeIn: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  timeOut: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
}, {
  tableName: 'warehouse_access',
  underscored: true,
});

module.exports = WarehouseAccess;
