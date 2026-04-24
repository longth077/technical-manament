const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const users = sequelize.define('users', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING(255), unique: true, allowNull: false },
  email: { type: DataTypes.STRING(255), unique: true, allowNull: false },
  password: { type: DataTypes.STRING(255), allowNull: false },
  full_name: { type: DataTypes.STRING(255), allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'user', 'readonly'), allowNull: false, defaultValue: 'user' },
  status: { type: DataTypes.ENUM('pending', 'approved'), allowNull: false, defaultValue: 'pending' },
}, { underscored: true });

const unit_info = sequelize.define('unit_info', {
  id: { type: DataTypes.TINYINT.UNSIGNED, primaryKey: true, defaultValue: 1 },
  unit_name: { type: DataTypes.STRING(255), allowNull: false, defaultValue: 'TRUNG TÂM CÔNG NGHỆ XỬ LÝ BOM MÌN' },
  technical_officer: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  statistician: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
}, { timestamps: false });

const overview = sequelize.define('overview', {
  id: { type: DataTypes.TINYINT.UNSIGNED, primaryKey: true, defaultValue: 1 },
  position: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  area: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  warehouse_system: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  fence_system: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  road_system: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  fire_system: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  terrain_map: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  land_certificate: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
}, { timestamps: false });

const staff = sequelize.define('staff', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  full_name: { type: DataTypes.STRING(255), allowNull: false },
  date_of_birth: { type: DataTypes.DATEONLY },
  id_number: { type: DataTypes.STRING(255), allowNull: false },
  rank: { type: DataTypes.STRING(255), allowNull: false },
  position: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  unit_department: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  education: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  assigned_warehouse: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  assigned_weapons: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  assigned_vehicles: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  assigned_equipment: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
}, { underscored: true });

const warehouses = sequelize.define('warehouses', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  code: { type: DataTypes.STRING(255), allowNull: false },
  function_desc: { type: DataTypes.STRING(255), allowNull: false },
  keeper: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  managing_unit: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  area: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  construction_date: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  notes: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
}, { underscored: true });

const warehouse_images = sequelize.define('warehouse_images', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  warehouse_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  file_path: { type: DataTypes.STRING(255), allowNull: false },
  file_type: { type: DataTypes.STRING(255), allowNull: false, defaultValue: 'image/jpeg' },
  description: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  uploaded_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, { timestamps: false });

const warehouse_equipment = sequelize.define('warehouse_equipment', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  warehouse_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  name: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  model: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  country: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  certification: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  maintenance: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  import_export: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
}, { timestamps: false });

const warehouse_inspections = sequelize.define('warehouse_inspections', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  warehouse_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  date: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  inspector_name: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  inspector_position: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  content: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  evaluation: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  requirements: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  server_name: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
}, { timestamps: false });

const warehouse_access = sequelize.define('warehouse_access', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  warehouse_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  date: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  visitor_name: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  companion_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  unit: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  responsible_person: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  time_in: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  time_out: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
}, { timestamps: false });

const warehouse_handover = sequelize.define('warehouse_handover', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  warehouse_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  equipment_name: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  unit: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  handover_date: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  quality_level: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  giver: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  receiver: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  return_date: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  return_quality: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  return_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  return_giver: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  return_receiver: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
}, { timestamps: false });

const warehouse_exports = sequelize.define('warehouse_exports', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  warehouse_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  receiver_name: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  receiver_unit: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  reason: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  item_name: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  unit_measure: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  required_quantity: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
  actual_quantity: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
  unit_price: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
  total_price: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
  notes: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
}, { timestamps: false });

const warehouse_imports = sequelize.define('warehouse_imports', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  warehouse_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  sender_name: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  sender_unit: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  reason: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  item_name: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  unit_measure: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  required_quantity: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
  actual_quantity: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
  unit_price: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
  total_price: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
  notes: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
}, { timestamps: false });

const warehouse_lightning = sequelize.define('warehouse_lightning', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  warehouse_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  date: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  weather: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  direct_rod1_rdo: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  direct_rod1_rxk: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  direct_rod1_result: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  direct_rod2_rdo: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  direct_rod2_rxk: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  direct_rod2_result: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  direct_rod3_rdo: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  direct_rod3_rxk: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  direct_rod3_result: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  induction_rdo: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  induction_result: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
}, { timestamps: false });

const weapons = sequelize.define('weapons', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  classification: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  unit_measure: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  country: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  year: { type: DataTypes.INTEGER },
  assigned_unit: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  assigned_individual: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, { underscored: true });

const tech_equipment = sequelize.define('tech_equipment', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  classification: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  unit_measure: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  country: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  year: { type: DataTypes.INTEGER },
  allocation: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  repair: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  operating_hours: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
}, { underscored: true });

const vehicles = sequelize.define('vehicles', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  classification: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  brand: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  vehicle_type: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  country: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  year: { type: DataTypes.INTEGER },
  allocation: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  repair: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  operating_hours: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
  km: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
}, { underscored: true });

const materials = sequelize.define('materials', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  classification: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  unit_measure: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  country: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  year: { type: DataTypes.INTEGER },
  assigned_unit: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  assigned_individual: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, { underscored: true });

const models = {
  users,
  unit_info,
  overview,
  staff,
  warehouses,
  warehouse_images,
  warehouse_equipment,
  warehouse_inspections,
  warehouse_access,
  warehouse_handover,
  warehouse_exports,
  warehouse_imports,
  warehouse_lightning,
  weapons,
  tech_equipment,
  vehicles,
  materials,
};

[
  warehouse_images,
  warehouse_equipment,
  warehouse_inspections,
  warehouse_access,
  warehouse_handover,
  warehouse_exports,
  warehouse_imports,
  warehouse_lightning,
].forEach((model) => {
  warehouses.hasMany(model, { foreignKey: 'warehouse_id', onDelete: 'CASCADE' });
  model.belongsTo(warehouses, { foreignKey: 'warehouse_id' });
});

module.exports = { sequelize, models };
