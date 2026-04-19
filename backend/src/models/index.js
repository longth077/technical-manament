const sequelize = require('../config/database');
const User = require('./User');
const UnitInfo = require('./UnitInfo');
const Overview = require('./Overview');
const Staff = require('./Staff');
const Warehouse = require('./Warehouse');
const WarehouseEquipment = require('./WarehouseEquipment');
const WarehouseInspection = require('./WarehouseInspection');
const WarehouseAccess = require('./WarehouseAccess');
const WarehouseHandover = require('./WarehouseHandover');
const WarehouseExport = require('./WarehouseExport');
const WarehouseImport = require('./WarehouseImport');
const WarehouseLightning = require('./WarehouseLightning');
const Weapon = require('./Weapon');
const TechEquipment = require('./TechEquipment');
const Vehicle = require('./Vehicle');
const Material = require('./Material');

// Warehouse associations
Warehouse.hasMany(WarehouseEquipment, { foreignKey: 'warehouseId', as: 'equipment' });
WarehouseEquipment.belongsTo(Warehouse, { foreignKey: 'warehouseId' });

Warehouse.hasMany(WarehouseInspection, { foreignKey: 'warehouseId', as: 'inspections' });
WarehouseInspection.belongsTo(Warehouse, { foreignKey: 'warehouseId' });

Warehouse.hasMany(WarehouseAccess, { foreignKey: 'warehouseId', as: 'access' });
WarehouseAccess.belongsTo(Warehouse, { foreignKey: 'warehouseId' });

Warehouse.hasMany(WarehouseHandover, { foreignKey: 'warehouseId', as: 'handover' });
WarehouseHandover.belongsTo(Warehouse, { foreignKey: 'warehouseId' });

Warehouse.hasMany(WarehouseExport, { foreignKey: 'warehouseId', as: 'exports' });
WarehouseExport.belongsTo(Warehouse, { foreignKey: 'warehouseId' });

Warehouse.hasMany(WarehouseImport, { foreignKey: 'warehouseId', as: 'imports' });
WarehouseImport.belongsTo(Warehouse, { foreignKey: 'warehouseId' });

Warehouse.hasMany(WarehouseLightning, { foreignKey: 'warehouseId', as: 'lightning' });
WarehouseLightning.belongsTo(Warehouse, { foreignKey: 'warehouseId' });

module.exports = {
  sequelize,
  User,
  UnitInfo,
  Overview,
  Staff,
  Warehouse,
  WarehouseEquipment,
  WarehouseInspection,
  WarehouseAccess,
  WarehouseHandover,
  WarehouseExport,
  WarehouseImport,
  WarehouseLightning,
  Weapon,
  TechEquipment,
  Vehicle,
  Material,
};
