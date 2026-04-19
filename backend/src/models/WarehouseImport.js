const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WarehouseImport = sequelize.define('WarehouseImport', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  warehouseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  senderName: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  senderUnit: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  reason: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  itemName: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  unitMeasure: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  requiredQuantity: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  actualQuantity: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  unitPrice: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  totalPrice: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  notes: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
}, {
  tableName: 'warehouse_imports',
  underscored: true,
});

module.exports = WarehouseImport;
