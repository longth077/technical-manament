const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WarehouseExport = sequelize.define('WarehouseExport', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  warehouseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  receiverName: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  receiverUnit: {
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
  tableName: 'warehouse_exports',
  underscored: true,
});

module.exports = WarehouseExport;
