const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WarehouseHandover = sequelize.define('WarehouseHandover', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  warehouseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  equipmentName: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  unit: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  handoverDate: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  qualityLevel: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  quantity: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  giver: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  receiver: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  returnDate: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  returnQuality: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  returnQuantity: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  returnGiver: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  returnReceiver: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
}, {
  tableName: 'warehouse_handovers',
  underscored: true,
});

module.exports = WarehouseHandover;
