const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WarehouseEquipment = sequelize.define('WarehouseEquipment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  warehouseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  model: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  country: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  certification: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  maintenance: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  importExport: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
}, {
  tableName: 'warehouse_equipment',
  underscored: true,
});

module.exports = WarehouseEquipment;
