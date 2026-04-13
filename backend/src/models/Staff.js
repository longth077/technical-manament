const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Staff = sequelize.define('Staff', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fullName: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  dateOfBirth: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  idNumber: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  rank: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  position: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  unitDepartment: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  education: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  assignedWarehouse: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  assignedWeapons: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  assignedVehicles: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  assignedEquipment: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
}, {
  tableName: 'staff',
  underscored: true,
});

module.exports = Staff;
