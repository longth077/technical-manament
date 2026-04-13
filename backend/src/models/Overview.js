const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Overview = sequelize.define('Overview', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    defaultValue: 1,
  },
  position: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  area: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  warehouseSystem: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  fenceSystem: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  roadSystem: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  fireSystem: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  terrainMap: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  landCertificate: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
}, {
  tableName: 'overviews',
  underscored: true,
});

module.exports = Overview;
