const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WarehouseLightning = sequelize.define('WarehouseLightning', {
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
  weather: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  directRod1Rdo: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  directRod1Rxk: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  directRod1Result: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  directRod2Rdo: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  directRod2Rxk: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  directRod2Result: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  directRod3Rdo: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  directRod3Rxk: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  directRod3Result: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  inductionRdo: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  inductionResult: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
}, {
  tableName: 'warehouse_lightning',
  underscored: true,
});

module.exports = WarehouseLightning;
