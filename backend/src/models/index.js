const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// ─── enum_constants ───────────────────────────────────────────────────────────
const enum_constants = sequelize.define('enum_constants', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  enum: { type: DataTypes.STRING(255), allowNull: false },
  type: { type: DataTypes.STRING(100), allowNull: false },
  created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, { tableName: 'enum_constants', timestamps: false });

// ─── users ────────────────────────────────────────────────────────────────────
const users = sequelize.define('users', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING(255), unique: true, allowNull: false },
  email: { type: DataTypes.STRING(255), unique: true, allowNull: false },
  password: { type: DataTypes.STRING(255), allowNull: false },
  full_name: { type: DataTypes.STRING(255), allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'user', 'readonly'), allowNull: false, defaultValue: 'user' },
  status: { type: DataTypes.ENUM('pending', 'approved'), allowNull: false, defaultValue: 'pending' },
}, { tableName: 'users', underscored: true });

// ─── unit_infos ───────────────────────────────────────────────────────────────
const unit_infos = sequelize.define('unit_infos', {
  id: { type: DataTypes.TINYINT.UNSIGNED, primaryKey: true, defaultValue: 1 },
  unit_name: { type: DataTypes.STRING(255), allowNull: false, defaultValue: 'TRUNG TÂM CÔNG NGHỆ XỬ LÝ BOM MÌN' },
  technical_officer: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  statistician: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
}, { tableName: 'unit_infos', timestamps: false });

// ─── overviews ────────────────────────────────────────────────────────────────
const overviews = sequelize.define('overviews', {
  id: { type: DataTypes.TINYINT.UNSIGNED, primaryKey: true, defaultValue: 1 },
  position: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  area: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  warehouse_system: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  fence_system: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  road_system: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  fire_system: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  terrain_map: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  land_certificate: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
}, { tableName: 'overviews', timestamps: false });

// ─── staffs ───────────────────────────────────────────────────────────────────
// rank_id and education_id reference enum_constants
const staffs = sequelize.define('staffs', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  full_name: { type: DataTypes.STRING(255), allowNull: false },
  date_of_birth: { type: DataTypes.DATEONLY, allowNull: true },
  id_number: { type: DataTypes.STRING(255), allowNull: false },
  rank_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  position: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  unit_department: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  education_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
}, { tableName: 'staffs', underscored: true });

// ─── warehouses ───────────────────────────────────────────────────────────────
const warehouses = sequelize.define('warehouses', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  code: { type: DataTypes.STRING(255), allowNull: false },
  function_desc: { type: DataTypes.STRING(255), allowNull: false },
  keeper_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
  managing_unit: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  area: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  construction_date: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  notes: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
}, { tableName: 'warehouses', underscored: true });

// ─── warehouse sub-tables ─────────────────────────────────────────────────────
// file_type_id references enum_constants (warehouse_image_file_type)
const warehouse_images = sequelize.define('warehouse_images', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  warehouse_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  file_path: { type: DataTypes.STRING(255), allowNull: false },
  file_type_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  description: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  uploaded_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, { tableName: 'warehouse_images', timestamps: false });

const warehouse_equipments = sequelize.define('warehouse_equipments', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  warehouse_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  name: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  model: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  country: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  certification: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  maintenance: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  import_export: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
}, { tableName: 'warehouse_equipments', timestamps: false });

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
}, { tableName: 'warehouse_inspections', timestamps: false });

const warehouse_accesses = sequelize.define('warehouse_accesses', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  warehouse_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  date: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  visitor_name: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  companion_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  unit: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  responsible_person: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  time_in: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  time_out: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
}, { tableName: 'warehouse_accesses', timestamps: false });

const warehouse_handovers = sequelize.define('warehouse_handovers', {
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
}, { tableName: 'warehouse_handovers', timestamps: false });

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
}, { tableName: 'warehouse_exports', timestamps: false });

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
}, { tableName: 'warehouse_imports', timestamps: false });

const warehouse_lightnings = sequelize.define('warehouse_lightnings', {
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
}, { tableName: 'warehouse_lightnings', timestamps: false });

// ─── weapons ──────────────────────────────────────────────────────────────────
const weapons = sequelize.define('weapons', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  classification: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  unit_measure: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  country: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  year: { type: DataTypes.INTEGER, allowNull: true },
  assigned_unit: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  assigned_individual: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, { tableName: 'weapons', underscored: true });

// ─── tech_equipments ─────────────────────────────────────────────────────────
// repair_id references enum_constants (repair_status)
const tech_equipments = sequelize.define('tech_equipments', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  classification: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  unit_measure: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  country: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  year: { type: DataTypes.INTEGER, allowNull: true },
  allocation: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  repair_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  operating_hours: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
}, { tableName: 'tech_equipments', underscored: true });

// ─── vehicles ────────────────────────────────────────────────────────────────
// repair_id references enum_constants (repair_status)
const vehicles = sequelize.define('vehicles', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  classification: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  brand: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  vehicle_type: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  country: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  year: { type: DataTypes.INTEGER, allowNull: true },
  allocation: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  repair_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  operating_hours: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
  km: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
}, { tableName: 'vehicles', underscored: true });

// ─── materials ───────────────────────────────────────────────────────────────
const materials = sequelize.define('materials', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  classification: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  unit_measure: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  country: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  year: { type: DataTypes.INTEGER, allowNull: true },
  assigned_unit: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  assigned_individual: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, { tableName: 'materials', underscored: true });

// ─── staff assignment junction tables ────────────────────────────────────────
// Generated columns (staff_key, *_key) are managed by MySQL and excluded here.

const staff_warehouses = sequelize.define('staff_warehouses', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  staff_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
  staff_name: { type: DataTypes.STRING(255), allowNull: true },
  warehouse_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
  warehouse_code: { type: DataTypes.STRING(255), allowNull: true },
  is_main_keeper: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  assigned_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, { tableName: 'staff_warehouses', timestamps: false });

const staff_weapons = sequelize.define('staff_weapons', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  staff_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
  staff_name: { type: DataTypes.STRING(255), allowNull: true },
  weapon_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
  weapon_name: { type: DataTypes.STRING(255), allowNull: true },
  assigned_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, { tableName: 'staff_weapons', timestamps: false });

const staff_vehicles = sequelize.define('staff_vehicles', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  staff_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
  staff_name: { type: DataTypes.STRING(255), allowNull: true },
  vehicle_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
  vehicle_name: { type: DataTypes.STRING(255), allowNull: true },
  assigned_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, { tableName: 'staff_vehicles', timestamps: false });

const staff_tech_equipment = sequelize.define('staff_tech_equipment', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  staff_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
  staff_name: { type: DataTypes.STRING(255), allowNull: true },
  tech_equipment_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
  tech_equipment_name: { type: DataTypes.STRING(255), allowNull: true },
  assigned_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, { tableName: 'staff_tech_equipment', timestamps: false });

// ─── Associations ─────────────────────────────────────────────────────────────

// staffs ← enum_constants (rank, education)
staffs.belongsTo(enum_constants, { foreignKey: 'rank_id', as: 'rank' });
staffs.belongsTo(enum_constants, { foreignKey: 'education_id', as: 'education' });

// tech_equipments / vehicles / warehouse_images ← enum_constants
tech_equipments.belongsTo(enum_constants, { foreignKey: 'repair_id', as: 'repair' });
vehicles.belongsTo(enum_constants, { foreignKey: 'repair_id', as: 'repair' });
warehouse_images.belongsTo(enum_constants, { foreignKey: 'file_type_id', as: 'file_type' });

// warehouses → sub-tables (cascade delete)
const warehouseChildren = [
  warehouse_images,
  warehouse_equipments,
  warehouse_inspections,
  warehouse_accesses,
  warehouse_handovers,
  warehouse_exports,
  warehouse_imports,
  warehouse_lightnings,
];
warehouseChildren.forEach((model) => {
  warehouses.hasMany(model, { foreignKey: 'warehouse_id', onDelete: 'CASCADE' });
  model.belongsTo(warehouses, { foreignKey: 'warehouse_id' });
});

// staffs ↔ entities via junction tables
staffs.hasMany(staff_warehouses, { foreignKey: 'staff_id' });
staff_warehouses.belongsTo(staffs, { foreignKey: 'staff_id' });
warehouses.hasMany(staff_warehouses, { foreignKey: 'warehouse_id' });
staff_warehouses.belongsTo(warehouses, { foreignKey: 'warehouse_id' });

staffs.hasMany(staff_weapons, { foreignKey: 'staff_id' });
staff_weapons.belongsTo(staffs, { foreignKey: 'staff_id' });
weapons.hasMany(staff_weapons, { foreignKey: 'weapon_id' });
staff_weapons.belongsTo(weapons, { foreignKey: 'weapon_id' });

staffs.hasMany(staff_vehicles, { foreignKey: 'staff_id' });
staff_vehicles.belongsTo(staffs, { foreignKey: 'staff_id' });
vehicles.hasMany(staff_vehicles, { foreignKey: 'vehicle_id' });
staff_vehicles.belongsTo(vehicles, { foreignKey: 'vehicle_id' });

staffs.hasMany(staff_tech_equipment, { foreignKey: 'staff_id' });
staff_tech_equipment.belongsTo(staffs, { foreignKey: 'staff_id' });
tech_equipments.hasMany(staff_tech_equipment, { foreignKey: 'tech_equipment_id' });
staff_tech_equipment.belongsTo(tech_equipments, { foreignKey: 'tech_equipment_id' });

const models = {
  users,
  enum_constants,
  unit_infos,
  overviews,
  staffs,
  warehouses,
  warehouse_images,
  warehouse_equipments,
  warehouse_inspections,
  warehouse_accesses,
  warehouse_handovers,
  warehouse_exports,
  warehouse_imports,
  warehouse_lightnings,
  weapons,
  tech_equipments,
  vehicles,
  materials,
  staff_warehouses,
  staff_weapons,
  staff_vehicles,
  staff_tech_equipment,
};

module.exports = { sequelize, models };
