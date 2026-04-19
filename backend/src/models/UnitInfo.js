const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UnitInfo = sequelize.define('UnitInfo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    defaultValue: 1,
  },
  unitName: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  technicalOfficer: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  statistician: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
}, {
  tableName: 'unit_info',
  underscored: true,
});

module.exports = UnitInfo;
