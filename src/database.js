const BetterSqlite3 = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

class Database {
  constructor() {
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const dbPath = path.join(dataDir, 'technical-management.db');
    this.db = new BetterSqlite3(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
  }

  initialize() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS unit_info (
        id INTEGER PRIMARY KEY DEFAULT 1,
        unit_name TEXT DEFAULT 'TRUNG TÂM CÔNG NGHỆ XỬ LÝ BOM MÌN',
        technical_officer TEXT DEFAULT '',
        statistician TEXT DEFAULT ''
      );

      INSERT OR IGNORE INTO unit_info (id) VALUES (1);

      CREATE TABLE IF NOT EXISTS overview (
        id INTEGER PRIMARY KEY DEFAULT 1,
        position TEXT DEFAULT '',
        area TEXT DEFAULT '',
        warehouse_system TEXT DEFAULT '',
        fence_system TEXT DEFAULT '',
        road_system TEXT DEFAULT '',
        fire_system TEXT DEFAULT '',
        terrain_map TEXT DEFAULT '',
        land_certificate TEXT DEFAULT ''
      );

      INSERT OR IGNORE INTO overview (id) VALUES (1);

      CREATE TABLE IF NOT EXISTS staff (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL DEFAULT '',
        date_of_birth TEXT DEFAULT '',
        id_number TEXT DEFAULT '',
        rank TEXT DEFAULT '',
        position TEXT DEFAULT '',
        unit_department TEXT DEFAULT '',
        education TEXT DEFAULT '',
        assigned_warehouse TEXT DEFAULT '',
        assigned_weapons TEXT DEFAULT '',
        assigned_vehicles TEXT DEFAULT '',
        assigned_equipment TEXT DEFAULT ''
      );

      CREATE TABLE IF NOT EXISTS warehouses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL DEFAULT '',
        function_desc TEXT DEFAULT '',
        keeper TEXT DEFAULT '',
        managing_unit TEXT DEFAULT '',
        area TEXT DEFAULT '',
        construction_date TEXT DEFAULT '',
        notes TEXT DEFAULT ''
      );

      CREATE TABLE IF NOT EXISTS warehouse_equipment (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        warehouse_id INTEGER NOT NULL,
        name TEXT DEFAULT '',
        model TEXT DEFAULT '',
        country TEXT DEFAULT '',
        certification TEXT DEFAULT '',
        maintenance TEXT DEFAULT '',
        import_export TEXT DEFAULT '',
        FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS warehouse_inspections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        warehouse_id INTEGER NOT NULL,
        date TEXT DEFAULT '',
        inspector_name TEXT DEFAULT '',
        inspector_position TEXT DEFAULT '',
        content TEXT DEFAULT '',
        evaluation TEXT DEFAULT '',
        requirements TEXT DEFAULT '',
        server_name TEXT DEFAULT '',
        FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS warehouse_access (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        warehouse_id INTEGER NOT NULL,
        date TEXT DEFAULT '',
        visitor_name TEXT DEFAULT '',
        companion_count TEXT DEFAULT '',
        unit TEXT DEFAULT '',
        responsible_person TEXT DEFAULT '',
        time_in TEXT DEFAULT '',
        time_out TEXT DEFAULT '',
        FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS warehouse_handover (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        warehouse_id INTEGER NOT NULL,
        equipment_name TEXT DEFAULT '',
        unit TEXT DEFAULT '',
        handover_date TEXT DEFAULT '',
        quality_level TEXT DEFAULT '',
        quantity TEXT DEFAULT '',
        giver TEXT DEFAULT '',
        receiver TEXT DEFAULT '',
        return_date TEXT DEFAULT '',
        return_quality TEXT DEFAULT '',
        return_quantity TEXT DEFAULT '',
        return_giver TEXT DEFAULT '',
        return_receiver TEXT DEFAULT '',
        FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS warehouse_exports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        warehouse_id INTEGER NOT NULL,
        receiver_name TEXT DEFAULT '',
        receiver_unit TEXT DEFAULT '',
        reason TEXT DEFAULT '',
        item_name TEXT DEFAULT '',
        unit_measure TEXT DEFAULT '',
        required_quantity TEXT DEFAULT '',
        actual_quantity TEXT DEFAULT '',
        unit_price TEXT DEFAULT '',
        total_price TEXT DEFAULT '',
        notes TEXT DEFAULT '',
        FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS warehouse_imports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        warehouse_id INTEGER NOT NULL,
        sender_name TEXT DEFAULT '',
        sender_unit TEXT DEFAULT '',
        reason TEXT DEFAULT '',
        item_name TEXT DEFAULT '',
        unit_measure TEXT DEFAULT '',
        required_quantity TEXT DEFAULT '',
        actual_quantity TEXT DEFAULT '',
        unit_price TEXT DEFAULT '',
        total_price TEXT DEFAULT '',
        notes TEXT DEFAULT '',
        FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS warehouse_lightning (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        warehouse_id INTEGER NOT NULL,
        date TEXT DEFAULT '',
        weather TEXT DEFAULT '',
        direct_rod1_rdo TEXT DEFAULT '',
        direct_rod1_rxk TEXT DEFAULT '',
        direct_rod1_result TEXT DEFAULT '',
        direct_rod2_rdo TEXT DEFAULT '',
        direct_rod2_rxk TEXT DEFAULT '',
        direct_rod2_result TEXT DEFAULT '',
        direct_rod3_rdo TEXT DEFAULT '',
        direct_rod3_rxk TEXT DEFAULT '',
        direct_rod3_result TEXT DEFAULT '',
        induction_rdo TEXT DEFAULT '',
        induction_result TEXT DEFAULT '',
        FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS weapons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL DEFAULT '',
        classification TEXT DEFAULT '',
        unit_measure TEXT DEFAULT '',
        quantity TEXT DEFAULT '',
        country TEXT DEFAULT '',
        year TEXT DEFAULT '',
        assigned_unit TEXT DEFAULT '',
        assigned_individual TEXT DEFAULT ''
      );

      CREATE TABLE IF NOT EXISTS tech_equipment (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL DEFAULT '',
        classification TEXT DEFAULT '',
        unit_measure TEXT DEFAULT '',
        quantity TEXT DEFAULT '',
        country TEXT DEFAULT '',
        year TEXT DEFAULT '',
        assigned_unit TEXT DEFAULT '',
        assigned_individual TEXT DEFAULT '',
        repair TEXT DEFAULT '',
        operating_hours TEXT DEFAULT ''
      );

      CREATE TABLE IF NOT EXISTS vehicles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL DEFAULT '',
        classification TEXT DEFAULT '',
        brand TEXT DEFAULT '',
        vehicle_type TEXT DEFAULT '',
        country TEXT DEFAULT '',
        year TEXT DEFAULT '',
        assigned_unit TEXT DEFAULT '',
        assigned_individual TEXT DEFAULT '',
        repair TEXT DEFAULT '',
        operating_hours TEXT DEFAULT '',
        km TEXT DEFAULT ''
      );

      CREATE TABLE IF NOT EXISTS materials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL DEFAULT '',
        classification TEXT DEFAULT '',
        unit_measure TEXT DEFAULT '',
        quantity TEXT DEFAULT '',
        country TEXT DEFAULT '',
        year TEXT DEFAULT '',
        assigned_unit TEXT DEFAULT '',
        assigned_individual TEXT DEFAULT ''
      );
    `);
  }

  getUnitInfo() {
    return this.db.prepare('SELECT * FROM unit_info WHERE id = 1').get();
  }

  saveUnitInfo(data) {
    const stmt = this.db.prepare(`
      UPDATE unit_info SET unit_name = ?, technical_officer = ?, statistician = ? WHERE id = 1
    `);
    stmt.run(data.unit_name, data.technical_officer, data.statistician);
    return this.getUnitInfo();
  }

  getOverview() {
    return this.db.prepare('SELECT * FROM overview WHERE id = 1').get();
  }

  saveOverview(data) {
    const stmt = this.db.prepare(`
      UPDATE overview SET position = ?, area = ?, warehouse_system = ?, fence_system = ?,
        road_system = ?, fire_system = ?, terrain_map = ?, land_certificate = ? WHERE id = 1
    `);
    stmt.run(
      data.position, data.area, data.warehouse_system, data.fence_system,
      data.road_system, data.fire_system, data.terrain_map, data.land_certificate
    );
    return this.getOverview();
  }

  getAll(table) {
    const allowed = [
      'staff', 'warehouses', 'weapons', 'tech_equipment', 'vehicles', 'materials',
      'warehouse_equipment', 'warehouse_inspections', 'warehouse_access',
      'warehouse_handover', 'warehouse_exports', 'warehouse_imports', 'warehouse_lightning'
    ];
    if (!allowed.includes(table)) throw new Error('Invalid table name');
    return this.db.prepare(`SELECT * FROM "${table}" ORDER BY id`).all();
  }

  getByWarehouse(table, warehouseId) {
    const allowed = [
      'warehouse_equipment', 'warehouse_inspections', 'warehouse_access',
      'warehouse_handover', 'warehouse_exports', 'warehouse_imports', 'warehouse_lightning'
    ];
    if (!allowed.includes(table)) throw new Error('Invalid table name');
    return this.db.prepare(`SELECT * FROM "${table}" WHERE warehouse_id = ? ORDER BY id`).all(warehouseId);
  }

  insert(table, data) {
    const allowed = [
      'staff', 'warehouses', 'weapons', 'tech_equipment', 'vehicles', 'materials',
      'warehouse_equipment', 'warehouse_inspections', 'warehouse_access',
      'warehouse_handover', 'warehouse_exports', 'warehouse_imports', 'warehouse_lightning'
    ];
    if (!allowed.includes(table)) throw new Error('Invalid table name');

    const keys = Object.keys(data);
    const placeholders = keys.map(() => '?').join(', ');
    const columns = keys.map(k => `"${k}"`).join(', ');
    const stmt = this.db.prepare(`INSERT INTO "${table}" (${columns}) VALUES (${placeholders})`);
    const result = stmt.run(...keys.map(k => data[k]));
    return { id: result.lastInsertRowid };
  }

  update(table, id, data) {
    const allowed = [
      'staff', 'warehouses', 'weapons', 'tech_equipment', 'vehicles', 'materials',
      'warehouse_equipment', 'warehouse_inspections', 'warehouse_access',
      'warehouse_handover', 'warehouse_exports', 'warehouse_imports', 'warehouse_lightning'
    ];
    if (!allowed.includes(table)) throw new Error('Invalid table name');

    const keys = Object.keys(data);
    const setClause = keys.map(k => `"${k}" = ?`).join(', ');
    const stmt = this.db.prepare(`UPDATE "${table}" SET ${setClause} WHERE id = ?`);
    stmt.run(...keys.map(k => data[k]), id);
    return { success: true };
  }

  remove(table, id) {
    const allowed = [
      'staff', 'warehouses', 'weapons', 'tech_equipment', 'vehicles', 'materials',
      'warehouse_equipment', 'warehouse_inspections', 'warehouse_access',
      'warehouse_handover', 'warehouse_exports', 'warehouse_imports', 'warehouse_lightning'
    ];
    if (!allowed.includes(table)) throw new Error('Invalid table name');
    this.db.prepare(`DELETE FROM "${table}" WHERE id = ?`).run(id);
    return { success: true };
  }

  close() {
    if (this.db) this.db.close();
  }
}

module.exports = Database;
