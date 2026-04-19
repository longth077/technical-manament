-- ============================================================================
-- DATABASE SCHEMA: QUẢN LÝ KỸ THUẬT (Technical Management)
-- ============================================================================
-- Database Engine: SQLite (better-sqlite3)
-- Generated from: "Phân tích phần mềm quản lý kỹ thuật.docx"
-- ============================================================================

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ============================================================================
-- 1. USERS (Authentication)
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    username    TEXT    NOT NULL UNIQUE,
    email       TEXT    NOT NULL UNIQUE,
    password    TEXT    NOT NULL,
    full_name   TEXT    NOT NULL,
    role        TEXT    NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TRIGGER IF NOT EXISTS users_updated_at
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    UPDATE users SET updated_at = datetime('now') WHERE id = OLD.id;
END;

-- ============================================================================
-- 2. UNIT INFO (Thông tin đơn vị) - singleton row
-- ============================================================================
CREATE TABLE IF NOT EXISTS unit_info (
    id                  INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    unit_name           TEXT    NOT NULL DEFAULT 'TRUNG TÂM CÔNG NGHỆ XỬ LÝ BOM MÌN',
    technical_officer   TEXT    NOT NULL DEFAULT '',
    statistician        TEXT    NOT NULL DEFAULT ''
);

INSERT OR IGNORE INTO unit_info (id) VALUES (1);

-- ============================================================================
-- 3. OVERVIEW (Tổng quan khu kỹ thuật) - singleton row
-- ============================================================================
CREATE TABLE IF NOT EXISTS overview (
    id                  INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    position            TEXT    NOT NULL DEFAULT '',
    area                TEXT    NOT NULL DEFAULT '',
    warehouse_system    TEXT    NOT NULL DEFAULT '',
    fence_system        TEXT    NOT NULL DEFAULT '',
    road_system         TEXT    NOT NULL DEFAULT '',
    fire_system         TEXT    NOT NULL DEFAULT '',
    terrain_map         TEXT    NOT NULL DEFAULT '',
    land_certificate    TEXT    NOT NULL DEFAULT ''
);

INSERT OR IGNORE INTO overview (id) VALUES (1);

-- ============================================================================
-- 4. STAFF (Danh sách cán bộ, chuyên môn kỹ thuật)
-- Section I of the document
-- ============================================================================
-- Constraints from document:
--   - full_name: NOT NULL (Không được để trống)
--   - date_of_birth: Must not be greater than current date
--   - id_number (CMTQĐ/CCCD): NOT NULL (Không được để trống)
--   - rank: Required selection (Bắt buộc chọn)
--   - Warehouse assignment: Required (can be added later)
-- ============================================================================
CREATE TABLE IF NOT EXISTS staff (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name           TEXT    NOT NULL CHECK (length(trim(full_name)) > 0),
    date_of_birth       TEXT    DEFAULT '',
    id_number           TEXT    NOT NULL CHECK (length(trim(id_number)) > 0),
    rank                TEXT    NOT NULL CHECK (
                            rank IN (
                                'Thiếu úy', 'Trung úy', 'Thượng uý', 'Đại úy',
                                'Thiếu tá', 'Trung tá', 'Thượng tá', 'Đại tá',
                                'Thiếu úy CN', 'Trung úy CN', 'Thượng uý CN',
                                'Đại úy CN', 'Thiếu tá CN', 'Trung tá CN'
                            )
                        ),
    position            TEXT    NOT NULL DEFAULT '',
    unit_department     TEXT    NOT NULL DEFAULT '',
    education           TEXT    NOT NULL DEFAULT '' CHECK (
                            education IN (
                                '', 'Sơ cấp', 'Trung cấp', 'Cao đẳng',
                                'Đại học', 'Thạc sĩ', 'Khác'
                            )
                        ),
    assigned_warehouse  TEXT    NOT NULL DEFAULT '',
    assigned_weapons    TEXT    NOT NULL DEFAULT '',
    assigned_vehicles   TEXT    NOT NULL DEFAULT '',
    assigned_equipment  TEXT    NOT NULL DEFAULT '',
    created_at          TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at          TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TRIGGER IF NOT EXISTS staff_updated_at
AFTER UPDATE ON staff
FOR EACH ROW
BEGIN
    UPDATE staff SET updated_at = datetime('now') WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS staff_validate_dob_insert
BEFORE INSERT ON staff
FOR EACH ROW
WHEN NEW.date_of_birth IS NOT NULL
     AND NEW.date_of_birth <> ''
     AND date(NEW.date_of_birth) > date('now')
BEGIN
    SELECT RAISE(ABORT, 'date_of_birth cannot be greater than current date');
END;

CREATE TRIGGER IF NOT EXISTS staff_validate_dob_update
BEFORE UPDATE OF date_of_birth ON staff
FOR EACH ROW
WHEN NEW.date_of_birth IS NOT NULL
     AND NEW.date_of_birth <> ''
     AND date(NEW.date_of_birth) > date('now')
BEGIN
    SELECT RAISE(ABORT, 'date_of_birth cannot be greater than current date');
END;

CREATE INDEX IF NOT EXISTS idx_staff_full_name ON staff(full_name);
CREATE INDEX IF NOT EXISTS idx_staff_rank ON staff(rank);
CREATE INDEX IF NOT EXISTS idx_staff_unit_department ON staff(unit_department);

-- ============================================================================
-- 5. WAREHOUSES (Kho/Trạm/Xưởng)
-- Section III of the document
-- ============================================================================
-- Constraints from document:
--   - code (name): NOT NULL (Không được để trống)
--   - function_desc: NOT NULL (Không được để trống)
--   - keeper: Optional (references staff)
--   - managing_unit: Optional
-- ============================================================================
CREATE TABLE IF NOT EXISTS warehouses (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    code                TEXT    NOT NULL CHECK (length(trim(code)) > 0),
    function_desc       TEXT    NOT NULL CHECK (length(trim(function_desc)) > 0),
    keeper              TEXT    NOT NULL DEFAULT '',
    managing_unit       TEXT    NOT NULL DEFAULT '',
    area                TEXT    NOT NULL DEFAULT '',
    construction_date   TEXT    NOT NULL DEFAULT '',
    notes               TEXT    NOT NULL DEFAULT '',
    created_at          TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at          TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TRIGGER IF NOT EXISTS warehouses_updated_at
AFTER UPDATE ON warehouses
FOR EACH ROW
BEGIN
    UPDATE warehouses SET updated_at = datetime('now') WHERE id = OLD.id;
END;

CREATE INDEX IF NOT EXISTS idx_warehouses_code ON warehouses(code);
CREATE INDEX IF NOT EXISTS idx_warehouses_managing_unit ON warehouses(managing_unit);

-- ============================================================================
-- 5a. WAREHOUSE IMAGES (Hình ảnh kho/trạm/xưởng)
-- Tab: Tổng quan - allows multiple images per warehouse
-- ============================================================================
CREATE TABLE IF NOT EXISTS warehouse_images (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    warehouse_id    INTEGER NOT NULL,
    file_path       TEXT    NOT NULL CHECK (length(trim(file_path)) > 0),
    file_type       TEXT    NOT NULL DEFAULT 'image/jpeg' CHECK (
                        file_type IN ('image/jpeg', 'image/png')
                    ),
    description     TEXT    NOT NULL DEFAULT '',
    uploaded_at     TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_warehouse_images_warehouse_id ON warehouse_images(warehouse_id);

-- ============================================================================
-- 5b. WAREHOUSE EQUIPMENT (Trang bị, vật tư trong kho)
-- Tab: Trang bị, Vật tư
-- ============================================================================
CREATE TABLE IF NOT EXISTS warehouse_equipment (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    warehouse_id    INTEGER NOT NULL,
    name            TEXT    NOT NULL DEFAULT '',
    model           TEXT    NOT NULL DEFAULT '',
    country         TEXT    NOT NULL DEFAULT '',
    certification   TEXT    NOT NULL DEFAULT '',
    maintenance     TEXT    NOT NULL DEFAULT '',
    import_export   TEXT    NOT NULL DEFAULT '',
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_warehouse_equipment_warehouse_id ON warehouse_equipment(warehouse_id);

-- ============================================================================
-- 5c. WAREHOUSE INSPECTIONS (Kiểm tra kho trạm xưởng)
-- Tab: Kiểm tra kho trạm xưởng
-- ============================================================================
CREATE TABLE IF NOT EXISTS warehouse_inspections (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    warehouse_id        INTEGER NOT NULL,
    date                TEXT    NOT NULL DEFAULT '',
    inspector_name      TEXT    NOT NULL DEFAULT '',
    inspector_position  TEXT    NOT NULL DEFAULT '',
    content             TEXT    NOT NULL DEFAULT '',
    evaluation          TEXT    NOT NULL DEFAULT '',
    requirements        TEXT    NOT NULL DEFAULT '',
    server_name         TEXT    NOT NULL DEFAULT '',
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_warehouse_inspections_warehouse_id ON warehouse_inspections(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_warehouse_inspections_date ON warehouse_inspections(date);

-- ============================================================================
-- 5d. WAREHOUSE ACCESS (Đăng ký ra vào kho trạm xưởng)
-- Tab: Đăng ký ra vào
-- ============================================================================
CREATE TABLE IF NOT EXISTS warehouse_access (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    warehouse_id        INTEGER NOT NULL,
    date                TEXT    NOT NULL DEFAULT '',
    visitor_name        TEXT    NOT NULL DEFAULT '',
    companion_count     INTEGER NOT NULL DEFAULT 0 CHECK (companion_count >= 0),
    unit                TEXT    NOT NULL DEFAULT '',
    responsible_person  TEXT    NOT NULL DEFAULT '',
    time_in             TEXT    NOT NULL DEFAULT '',
    time_out            TEXT    NOT NULL DEFAULT '',
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_warehouse_access_warehouse_id ON warehouse_access(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_warehouse_access_date ON warehouse_access(date);

-- ============================================================================
-- 5e. WAREHOUSE HANDOVER (Giao nhận tạm thời)
-- Tab: Giao nhận tạm thời
-- ============================================================================
CREATE TABLE IF NOT EXISTS warehouse_handover (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    warehouse_id        INTEGER NOT NULL,
    equipment_name      TEXT    NOT NULL DEFAULT '',
    unit                TEXT    NOT NULL DEFAULT '',
    handover_date       TEXT    NOT NULL DEFAULT '',
    quality_level       TEXT    NOT NULL DEFAULT '',
    quantity            INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    giver               TEXT    NOT NULL DEFAULT '',
    receiver            TEXT    NOT NULL DEFAULT '',
    return_date         TEXT    NOT NULL DEFAULT '',
    return_quality      TEXT    NOT NULL DEFAULT '',
    return_quantity     INTEGER NOT NULL DEFAULT 0 CHECK (return_quantity >= 0),
    return_giver        TEXT    NOT NULL DEFAULT '',
    return_receiver     TEXT    NOT NULL DEFAULT '',
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_warehouse_handover_warehouse_id ON warehouse_handover(warehouse_id);

-- ============================================================================
-- 5f. WAREHOUSE EXPORTS (Xuất kho)
-- Tab: Xuất kho
-- ============================================================================
CREATE TABLE IF NOT EXISTS warehouse_exports (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    warehouse_id        INTEGER NOT NULL,
    receiver_name       TEXT    NOT NULL DEFAULT '',
    receiver_unit       TEXT    NOT NULL DEFAULT '',
    reason              TEXT    NOT NULL DEFAULT '',
    item_name           TEXT    NOT NULL DEFAULT '',
    unit_measure        TEXT    NOT NULL DEFAULT '',
    required_quantity   REAL    NOT NULL DEFAULT 0 CHECK (required_quantity >= 0),
    actual_quantity     REAL    NOT NULL DEFAULT 0 CHECK (actual_quantity >= 0),
    unit_price          REAL    NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
    total_price         REAL    NOT NULL DEFAULT 0 CHECK (total_price >= 0),
    notes               TEXT    NOT NULL DEFAULT '',
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_warehouse_exports_warehouse_id ON warehouse_exports(warehouse_id);

-- ============================================================================
-- 5g. WAREHOUSE IMPORTS (Nhập kho)
-- Tab: Nhập kho
-- ============================================================================
CREATE TABLE IF NOT EXISTS warehouse_imports (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    warehouse_id        INTEGER NOT NULL,
    sender_name         TEXT    NOT NULL DEFAULT '',
    sender_unit         TEXT    NOT NULL DEFAULT '',
    reason              TEXT    NOT NULL DEFAULT '',
    item_name           TEXT    NOT NULL DEFAULT '',
    unit_measure        TEXT    NOT NULL DEFAULT '',
    required_quantity   REAL    NOT NULL DEFAULT 0 CHECK (required_quantity >= 0),
    actual_quantity     REAL    NOT NULL DEFAULT 0 CHECK (actual_quantity >= 0),
    unit_price          REAL    NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
    total_price         REAL    NOT NULL DEFAULT 0 CHECK (total_price >= 0),
    notes               TEXT    NOT NULL DEFAULT '',
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_warehouse_imports_warehouse_id ON warehouse_imports(warehouse_id);

-- ============================================================================
-- 5h. WAREHOUSE LIGHTNING (Chống sét)
-- Tab: Chống sét
-- ============================================================================
CREATE TABLE IF NOT EXISTS warehouse_lightning (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    warehouse_id        INTEGER NOT NULL,
    date                TEXT    NOT NULL DEFAULT '',
    weather             TEXT    NOT NULL DEFAULT '',
    direct_rod1_rdo     TEXT    NOT NULL DEFAULT '',
    direct_rod1_rxk     TEXT    NOT NULL DEFAULT '',
    direct_rod1_result  TEXT    NOT NULL DEFAULT '',
    direct_rod2_rdo     TEXT    NOT NULL DEFAULT '',
    direct_rod2_rxk     TEXT    NOT NULL DEFAULT '',
    direct_rod2_result  TEXT    NOT NULL DEFAULT '',
    direct_rod3_rdo     TEXT    NOT NULL DEFAULT '',
    direct_rod3_rxk     TEXT    NOT NULL DEFAULT '',
    direct_rod3_result  TEXT    NOT NULL DEFAULT '',
    induction_rdo       TEXT    NOT NULL DEFAULT '',
    induction_result    TEXT    NOT NULL DEFAULT '',
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_warehouse_lightning_warehouse_id ON warehouse_lightning(warehouse_id);

-- ============================================================================
-- 6. WEAPONS (Vũ khí trang bị)
-- Section IV of the document
-- ============================================================================
-- Constraints from document:
--   - name: NOT NULL (Không được để trống)
--   - quantity: >= 0
--   - year: Not greater than current year
--   - Unit/personal allocation are numbers and total <= quantity
-- ============================================================================
CREATE TABLE IF NOT EXISTS weapons (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    name                TEXT    NOT NULL CHECK (length(trim(name)) > 0),
    classification      TEXT    NOT NULL DEFAULT '',
    unit_measure        TEXT    NOT NULL DEFAULT '',
    quantity            INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    country             TEXT    NOT NULL DEFAULT '',
    year                INTEGER DEFAULT NULL,
    assigned_unit       INTEGER NOT NULL DEFAULT 0 CHECK (assigned_unit >= 0),
    assigned_individual INTEGER NOT NULL DEFAULT 0 CHECK (assigned_individual >= 0),
    created_at          TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at          TEXT    NOT NULL DEFAULT (datetime('now')),
    CHECK (year IS NULL OR year >= 1900),
    CHECK (assigned_unit + assigned_individual <= quantity)
);

CREATE TRIGGER IF NOT EXISTS weapons_updated_at
AFTER UPDATE ON weapons
FOR EACH ROW
BEGIN
    UPDATE weapons SET updated_at = datetime('now') WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS weapons_validate_year_insert
BEFORE INSERT ON weapons
FOR EACH ROW
WHEN NEW.year IS NOT NULL AND NEW.year > CAST(strftime('%Y', 'now') AS INTEGER)
BEGIN
    SELECT RAISE(ABORT, 'year cannot be greater than current year');
END;

CREATE TRIGGER IF NOT EXISTS weapons_validate_year_update
BEFORE UPDATE OF year ON weapons
FOR EACH ROW
WHEN NEW.year IS NOT NULL AND NEW.year > CAST(strftime('%Y', 'now') AS INTEGER)
BEGIN
    SELECT RAISE(ABORT, 'year cannot be greater than current year');
END;

CREATE INDEX IF NOT EXISTS idx_weapons_name ON weapons(name);
CREATE INDEX IF NOT EXISTS idx_weapons_classification ON weapons(classification);

-- ============================================================================
-- 7. TECH EQUIPMENT (Trang thiết bị kỹ thuật)
-- Section V of the document
-- ============================================================================
-- Constraints from document:
--   - name: NOT NULL (Không được để trống)
--   - quantity: >= 0
--   - year: Not greater than current year
--   - operating_hours: >= 0
--   - allocation (biên chế): Number
-- ============================================================================
CREATE TABLE IF NOT EXISTS tech_equipment (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    name                TEXT    NOT NULL CHECK (length(trim(name)) > 0),
    classification      TEXT    NOT NULL DEFAULT '',
    unit_measure        TEXT    NOT NULL DEFAULT '',
    quantity            INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    country             TEXT    NOT NULL DEFAULT '',
    year                INTEGER DEFAULT NULL,
    allocation          INTEGER NOT NULL DEFAULT 0 CHECK (allocation >= 0),
    repair              TEXT    NOT NULL DEFAULT '' CHECK (
                            repair IN ('', 'Chưa sửa', 'Đang sửa', 'Đã sửa')
                        ),
    operating_hours     REAL    NOT NULL DEFAULT 0 CHECK (operating_hours >= 0),
    created_at          TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at          TEXT    NOT NULL DEFAULT (datetime('now')),
    CHECK (year IS NULL OR year >= 1900),
    CHECK (allocation <= quantity)
);

CREATE TRIGGER IF NOT EXISTS tech_equipment_updated_at
AFTER UPDATE ON tech_equipment
FOR EACH ROW
BEGIN
    UPDATE tech_equipment SET updated_at = datetime('now') WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS tech_equipment_validate_year_insert
BEFORE INSERT ON tech_equipment
FOR EACH ROW
WHEN NEW.year IS NOT NULL AND NEW.year > CAST(strftime('%Y', 'now') AS INTEGER)
BEGIN
    SELECT RAISE(ABORT, 'year cannot be greater than current year');
END;

CREATE TRIGGER IF NOT EXISTS tech_equipment_validate_year_update
BEFORE UPDATE OF year ON tech_equipment
FOR EACH ROW
WHEN NEW.year IS NOT NULL AND NEW.year > CAST(strftime('%Y', 'now') AS INTEGER)
BEGIN
    SELECT RAISE(ABORT, 'year cannot be greater than current year');
END;

CREATE INDEX IF NOT EXISTS idx_tech_equipment_name ON tech_equipment(name);
CREATE INDEX IF NOT EXISTS idx_tech_equipment_classification ON tech_equipment(classification);

-- ============================================================================
-- 8. VEHICLES (Phương tiện)
-- Section VI of the document
-- ============================================================================
-- Constraints from document:
--   - name: NOT NULL (Không được để trống)
--   - year: Not greater than current year
--   - operating_hours: >= 0
--   - km: >= 0
--   - allocation (biên chế): Number
-- ============================================================================
CREATE TABLE IF NOT EXISTS vehicles (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    name                TEXT    NOT NULL CHECK (length(trim(name)) > 0),
    classification      TEXT    NOT NULL DEFAULT '',
    brand               TEXT    NOT NULL DEFAULT '',
    vehicle_type        TEXT    NOT NULL DEFAULT '',
    country             TEXT    NOT NULL DEFAULT '',
    year                INTEGER DEFAULT NULL,
    allocation          INTEGER NOT NULL DEFAULT 0 CHECK (allocation >= 0),
    repair              TEXT    NOT NULL DEFAULT '' CHECK (
                            repair IN ('', 'Chưa sửa', 'Đang sửa', 'Đã sửa')
                        ),
    operating_hours     REAL    NOT NULL DEFAULT 0 CHECK (operating_hours >= 0),
    km                  REAL    NOT NULL DEFAULT 0 CHECK (km >= 0),
    created_at          TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at          TEXT    NOT NULL DEFAULT (datetime('now')),
    CHECK (year IS NULL OR year >= 1900)
);

CREATE TRIGGER IF NOT EXISTS vehicles_updated_at
AFTER UPDATE ON vehicles
FOR EACH ROW
BEGIN
    UPDATE vehicles SET updated_at = datetime('now') WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS vehicles_validate_year_insert
BEFORE INSERT ON vehicles
FOR EACH ROW
WHEN NEW.year IS NOT NULL AND NEW.year > CAST(strftime('%Y', 'now') AS INTEGER)
BEGIN
    SELECT RAISE(ABORT, 'year cannot be greater than current year');
END;

CREATE TRIGGER IF NOT EXISTS vehicles_validate_year_update
BEFORE UPDATE OF year ON vehicles
FOR EACH ROW
WHEN NEW.year IS NOT NULL AND NEW.year > CAST(strftime('%Y', 'now') AS INTEGER)
BEGIN
    SELECT RAISE(ABORT, 'year cannot be greater than current year');
END;

CREATE INDEX IF NOT EXISTS idx_vehicles_name ON vehicles(name);
CREATE INDEX IF NOT EXISTS idx_vehicles_brand ON vehicles(brand);
CREATE INDEX IF NOT EXISTS idx_vehicles_vehicle_type ON vehicles(vehicle_type);

-- ============================================================================
-- 9. MATERIALS (Vật tư)
-- Section VII of the document
-- ============================================================================
-- Constraints from document:
--   - name: NOT NULL (Không được để trống)
--   - quantity: >= 0
--   - year: Not greater than current year
--   - Unit/personal allocation are numbers and total <= quantity
-- ============================================================================
CREATE TABLE IF NOT EXISTS materials (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    name                TEXT    NOT NULL CHECK (length(trim(name)) > 0),
    classification      TEXT    NOT NULL DEFAULT '',
    unit_measure        TEXT    NOT NULL DEFAULT '',
    quantity            INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    country             TEXT    NOT NULL DEFAULT '',
    year                INTEGER DEFAULT NULL,
    assigned_unit       INTEGER NOT NULL DEFAULT 0 CHECK (assigned_unit >= 0),
    assigned_individual INTEGER NOT NULL DEFAULT 0 CHECK (assigned_individual >= 0),
    created_at          TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at          TEXT    NOT NULL DEFAULT (datetime('now')),
    CHECK (year IS NULL OR year >= 1900),
    CHECK (assigned_unit + assigned_individual <= quantity)
);

CREATE TRIGGER IF NOT EXISTS materials_updated_at
AFTER UPDATE ON materials
FOR EACH ROW
BEGIN
    UPDATE materials SET updated_at = datetime('now') WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS materials_validate_year_insert
BEFORE INSERT ON materials
FOR EACH ROW
WHEN NEW.year IS NOT NULL AND NEW.year > CAST(strftime('%Y', 'now') AS INTEGER)
BEGIN
    SELECT RAISE(ABORT, 'year cannot be greater than current year');
END;

CREATE TRIGGER IF NOT EXISTS materials_validate_year_update
BEFORE UPDATE OF year ON materials
FOR EACH ROW
WHEN NEW.year IS NOT NULL AND NEW.year > CAST(strftime('%Y', 'now') AS INTEGER)
BEGIN
    SELECT RAISE(ABORT, 'year cannot be greater than current year');
END;

CREATE INDEX IF NOT EXISTS idx_materials_name ON materials(name);
CREATE INDEX IF NOT EXISTS idx_materials_classification ON materials(classification);


-- ============================================================================
-- ============================================================================
-- SAMPLE DATA INSERTION
-- ============================================================================
-- ============================================================================

-- ============================================================================
-- Sample Users
-- ============================================================================
-- Note: Passwords should be bcrypt-hashed in production. The values below are
-- placeholder hashes for illustration only.
INSERT INTO users (username, email, password, full_name, role) VALUES
    ('admin', 'admin@quanlykythuat.vn', '$2b$10$examplehashforpassword1234567890abcde', 'Quản Trị Viên', 'admin'),
    ('nvkt01', 'nvkt01@quanlykythuat.vn', '$2b$10$examplehashforpassword1234567890abcde', 'Nguyễn Văn An', 'user'),
    ('nvkt02', 'nvkt02@quanlykythuat.vn', '$2b$10$examplehashforpassword1234567890abcde', 'Trần Thị Bình', 'user');

-- ============================================================================
-- Sample Unit Info
-- ============================================================================
UPDATE unit_info SET
    unit_name = 'TRUNG TÂM CÔNG NGHỆ XỬ LÝ BOM MÌN',
    technical_officer = 'Đại tá Nguyễn Văn Hùng',
    statistician = 'Thiếu tá Trần Văn Minh'
WHERE id = 1;

-- ============================================================================
-- Sample Overview
-- ============================================================================
UPDATE overview SET
    position = 'Phường Tân Bình, Thành phố Hà Nội',
    area = '5000 m²',
    warehouse_system = 'Hệ thống 5 kho chứa vật tư và trang thiết bị',
    fence_system = 'Hàng rào bê tông cốt thép cao 2.5m, dây thép gai 3 lớp',
    road_system = 'Đường nội bộ bê tông nhựa rộng 4m',
    fire_system = 'Hệ thống chữa cháy tự động, 10 bình chữa cháy CO2',
    terrain_map = 'Có bản đồ địa hình tỷ lệ 1:500',
    land_certificate = 'Giấy chứng nhận QSDĐ số 1234/GCN-2020'
WHERE id = 1;

-- ============================================================================
-- Sample Staff (Danh sách cán bộ kỹ thuật)
-- ============================================================================
INSERT INTO staff (full_name, date_of_birth, id_number, rank, position, unit_department, education, assigned_warehouse, assigned_weapons, assigned_vehicles, assigned_equipment) VALUES
    ('Nguyễn Văn Hùng', '1975-03-15', 'QĐ-001234', 'Đại tá', 'Giám đốc Trung tâm', 'Cụm bộ', 'Đại học', 'Kho A1', 'Súng AK-47, Súng K54', 'Xe Toyota Land Cruiser', 'Máy dò mìn AN-19/2'),
    ('Trần Văn Minh', '1980-07-22', 'QĐ-002345', 'Thiếu tá', 'Phó Giám đốc', 'Cụm bộ', 'Thạc sĩ', 'Kho A2', 'Súng AK-47', 'Xe Hyundai HD72', 'Máy rà phá bom mìn'),
    ('Lê Thị Hoa', '1985-11-08', 'QĐ-003456', 'Đại úy', 'Trưởng phòng Kỹ thuật', 'Đội Dò tìm', 'Đại học', 'Kho B1', 'Súng K54', '', 'Thiết bị đo từ trường'),
    ('Phạm Đức Anh', '1988-05-30', 'QĐ-004567', 'Thượng uý', 'Nhân viên kỹ thuật', 'Đội Dò tìm', 'Cao đẳng', '', 'Súng AK-47', 'Xe tải Isuzu', ''),
    ('Hoàng Minh Tuấn', '1990-01-12', 'QĐ-005678', 'Trung úy', 'Thủ kho', 'Trạm xử lý', 'Trung cấp', 'Kho C1', '', '', 'Thiết bị kiểm định'),
    ('Vũ Thị Lan', '1992-09-25', 'QĐ-006789', 'Thiếu úy', 'Nhân viên thống kê', 'Cụm bộ', 'Đại học', '', '', '', ''),
    ('Đỗ Quang Hải', '1983-04-18', 'QĐ-007890', 'Trung tá', 'Đội trưởng Đội Dò tìm', 'Đội Dò tìm', 'Đại học', 'Kho A1, Kho B1', 'Súng AK-47, Súng M16', 'Xe Toyota Hilux', 'Máy dò mìn, Thiết bị GPS'),
    ('Bùi Văn Nam', '1987-12-05', 'QĐ-008901', 'Đại úy CN', 'Kỹ sư cơ khí', 'Trạm xử lý', 'Đại học', 'Kho C1', '', 'Xe cần cẩu', 'Máy hàn, Máy tiện');

-- ============================================================================
-- Sample Warehouses (Kho/Trạm/Xưởng)
-- ============================================================================
INSERT INTO warehouses (code, function_desc, keeper, managing_unit, area, construction_date, notes) VALUES
    ('Kho A1', 'Lưu trữ vũ khí, trang bị cấp 1', 'Nguyễn Văn Hùng', 'Cụm bộ', '200 m²', '2010-06-15', 'Kho chính, có hệ thống điều hòa'),
    ('Kho A2', 'Lưu trữ vũ khí, trang bị cấp 2', 'Trần Văn Minh', 'Cụm bộ', '150 m²', '2012-03-20', 'Kho phụ'),
    ('Kho B1', 'Bảo quản trang thiết bị kỹ thuật dò tìm', 'Lê Thị Hoa', 'Đội Dò tìm', '180 m²', '2015-08-10', 'Kho thiết bị chuyên dụng'),
    ('Kho C1', 'Lưu trữ vật tư, phụ tùng sửa chữa', 'Hoàng Minh Tuấn', 'Trạm xử lý', '250 m²', '2008-11-25', 'Kho vật tư tổng hợp'),
    ('Trạm sửa chữa T1', 'Sửa chữa, bảo dưỡng phương tiện và trang thiết bị', 'Bùi Văn Nam', 'Trạm xử lý', '300 m²', '2011-04-12', 'Trạm sửa chữa chính');

-- ============================================================================
-- Sample Warehouse Images
-- ============================================================================
INSERT INTO warehouse_images (warehouse_id, file_path, file_type, description) VALUES
    (1, '/uploads/warehouses/kho-a1-front.jpg', 'image/jpeg', 'Mặt trước Kho A1'),
    (1, '/uploads/warehouses/kho-a1-inside.png', 'image/png', 'Bên trong Kho A1'),
    (2, '/uploads/warehouses/kho-a2-overview.jpg', 'image/jpeg', 'Tổng quan Kho A2'),
    (3, '/uploads/warehouses/kho-b1-equipment.jpg', 'image/jpeg', 'Khu vực thiết bị Kho B1'),
    (5, '/uploads/warehouses/tram-t1-workshop.jpg', 'image/jpeg', 'Xưởng sửa chữa T1');

-- ============================================================================
-- Sample Warehouse Equipment (Trang bị vật tư trong kho)
-- ============================================================================
INSERT INTO warehouse_equipment (warehouse_id, name, model, country, certification, maintenance, import_export) VALUES
    (1, 'Tủ bảo quản vũ khí', 'TBQ-500', 'Việt Nam', 'Đạt - 2024', 'Bảo dưỡng 06/2025', 'Nhập: 50, Xuất: 10'),
    (1, 'Giá để đạn dược', 'GĐ-200', 'Việt Nam', 'Đạt - 2024', 'Bảo dưỡng 03/2025', 'Nhập: 20, Xuất: 5'),
    (2, 'Kệ chứa trang bị', 'KC-300', 'Việt Nam', 'Đạt - 2023', 'Bảo dưỡng 09/2024', 'Nhập: 30, Xuất: 8'),
    (3, 'Hộp bảo quản thiết bị điện tử', 'HBQ-E100', 'Nhật Bản', 'Đạt - 2024', 'Bảo dưỡng 12/2024', 'Nhập: 15, Xuất: 3'),
    (4, 'Kệ chứa vật tư', 'KVT-400', 'Việt Nam', 'Đạt - 2024', 'Bảo dưỡng 01/2025', 'Nhập: 100, Xuất: 45');

-- ============================================================================
-- Sample Warehouse Inspections (Kiểm tra kho)
-- ============================================================================
INSERT INTO warehouse_inspections (warehouse_id, date, inspector_name, inspector_position, content, evaluation, requirements, server_name) VALUES
    (1, '2025-01-15', 'Đỗ Quang Hải', 'Đội trưởng', 'Kiểm tra định kỳ tình trạng kho và trang thiết bị', 'Đạt yêu cầu, kho sạch sẽ, trang bị đầy đủ', 'Tiếp tục duy trì công tác bảo quản', 'Nguyễn Văn Hùng'),
    (1, '2025-04-10', 'Trần Văn Minh', 'Phó Giám đốc', 'Kiểm tra đột xuất sau mùa mưa', 'Phát hiện 1 vị trí thấm dột nhỏ', 'Sửa chữa mái kho trước 30/04/2025', 'Nguyễn Văn Hùng'),
    (2, '2025-02-20', 'Đỗ Quang Hải', 'Đội trưởng', 'Kiểm tra định kỳ quý 1', 'Đạt yêu cầu', 'Không có', 'Trần Văn Minh'),
    (3, '2025-03-05', 'Lê Thị Hoa', 'Trưởng phòng', 'Kiểm tra thiết bị dò tìm trước mùa hoạt động', 'Tốt, thiết bị hoạt động ổn định', 'Bổ sung pin dự phòng', 'Hoàng Minh Tuấn'),
    (4, '2025-01-28', 'Bùi Văn Nam', 'Kỹ sư cơ khí', 'Kiểm tra kho vật tư đầu năm', 'Đạt, cần bổ sung một số vật tư tiêu hao', 'Lập danh sách vật tư cần bổ sung', 'Hoàng Minh Tuấn');

-- ============================================================================
-- Sample Warehouse Access (Đăng ký ra vào kho)
-- ============================================================================
INSERT INTO warehouse_access (warehouse_id, date, visitor_name, companion_count, unit, responsible_person, time_in, time_out) VALUES
    (1, '2025-03-10', 'Phạm Đức Anh', 2, 'Đội Dò tìm', 'Nguyễn Văn Hùng', '08:30', '10:15'),
    (1, '2025-03-12', 'Đỗ Quang Hải', 0, 'Đội Dò tìm', 'Nguyễn Văn Hùng', '14:00', '15:30'),
    (2, '2025-03-15', 'Lê Thị Hoa', 1, 'Đội Dò tìm', 'Trần Văn Minh', '09:00', '11:00'),
    (3, '2025-04-01', 'Phạm Đức Anh', 3, 'Đội Dò tìm', 'Lê Thị Hoa', '07:30', '09:45'),
    (4, '2025-04-05', 'Bùi Văn Nam', 1, 'Trạm xử lý', 'Hoàng Minh Tuấn', '13:00', '16:00');

-- ============================================================================
-- Sample Warehouse Handover (Giao nhận tạm thời)
-- ============================================================================
INSERT INTO warehouse_handover (warehouse_id, equipment_name, unit, handover_date, quality_level, quantity, giver, receiver, return_date, return_quality, return_quantity, return_giver, return_receiver) VALUES
    (1, 'Súng AK-47', 'Khẩu', '2025-02-01', 'Cấp 1', 5, 'Nguyễn Văn Hùng', 'Phạm Đức Anh', '2025-02-15', 'Cấp 1', 5, 'Phạm Đức Anh', 'Nguyễn Văn Hùng'),
    (1, 'Đạn 7.62mm', 'Hộp', '2025-02-01', 'Cấp 1', 10, 'Nguyễn Văn Hùng', 'Phạm Đức Anh', '2025-02-15', 'Cấp 1', 8, 'Phạm Đức Anh', 'Nguyễn Văn Hùng'),
    (3, 'Máy dò mìn AN-19/2', 'Bộ', '2025-03-01', 'Cấp 1', 2, 'Lê Thị Hoa', 'Đỗ Quang Hải', '', '', 0, '', ''),
    (4, 'Bộ dụng cụ sửa chữa', 'Bộ', '2025-03-10', 'Cấp 2', 3, 'Hoàng Minh Tuấn', 'Bùi Văn Nam', '2025-03-20', 'Cấp 2', 3, 'Bùi Văn Nam', 'Hoàng Minh Tuấn');

-- ============================================================================
-- Sample Warehouse Exports (Xuất kho)
-- ============================================================================
INSERT INTO warehouse_exports (warehouse_id, receiver_name, receiver_unit, reason, item_name, unit_measure, required_quantity, actual_quantity, unit_price, total_price, notes) VALUES
    (4, 'Phạm Đức Anh', 'Đội Dò tìm', 'Phục vụ nhiệm vụ rà phá bom mìn tại Quảng Trị', 'Pin lithium 3V', 'Viên', 50, 50, 25000, 1250000, 'Xuất theo lệnh số 015/KT'),
    (4, 'Phạm Đức Anh', 'Đội Dò tìm', 'Phục vụ nhiệm vụ rà phá bom mìn tại Quảng Trị', 'Dây tín hiệu 5m', 'Cuộn', 10, 10, 150000, 1500000, 'Xuất theo lệnh số 015/KT'),
    (1, 'Đỗ Quang Hải', 'Đội Dò tìm', 'Huấn luyện định kỳ Q1/2025', 'Đạn tập 7.62mm', 'Viên', 200, 200, 5000, 1000000, ''),
    (4, 'Bùi Văn Nam', 'Trạm xử lý', 'Sửa chữa xe Toyota Land Cruiser', 'Dầu nhớt 5W-30', 'Lít', 20, 20, 180000, 3600000, '');

-- ============================================================================
-- Sample Warehouse Imports (Nhập kho)
-- ============================================================================
INSERT INTO warehouse_imports (warehouse_id, sender_name, sender_unit, reason, item_name, unit_measure, required_quantity, actual_quantity, unit_price, total_price, notes) VALUES
    (4, 'Công ty TNHH Vật Tư Quốc Phòng', 'Bên ngoài', 'Bổ sung vật tư tiêu hao Q1/2025', 'Pin lithium 3V', 'Viên', 200, 200, 25000, 5000000, 'Hóa đơn số HĐ-2025-0123'),
    (4, 'Công ty TNHH Vật Tư Quốc Phòng', 'Bên ngoài', 'Bổ sung vật tư tiêu hao Q1/2025', 'Dây tín hiệu 5m', 'Cuộn', 50, 50, 150000, 7500000, 'Hóa đơn số HĐ-2025-0123'),
    (1, 'Kho quân khu', 'Quân khu 4', 'Cấp phát đạn huấn luyện năm 2025', 'Đạn tập 7.62mm', 'Viên', 1000, 1000, 5000, 5000000, 'Phiếu xuất QK4-2025-045'),
    (4, 'Đại lý Toyota Việt Nam', 'Bên ngoài', 'Mua phụ tùng bảo dưỡng xe', 'Lọc dầu Toyota', 'Cái', 10, 10, 350000, 3500000, '');

-- ============================================================================
-- Sample Warehouse Lightning (Đo chống sét)
-- ============================================================================
INSERT INTO warehouse_lightning (warehouse_id, date, weather, direct_rod1_rdo, direct_rod1_rxk, direct_rod1_result, direct_rod2_rdo, direct_rod2_rxk, direct_rod2_result, direct_rod3_rdo, direct_rod3_rxk, direct_rod3_result, induction_rdo, induction_result) VALUES
    (1, '2025-01-10', 'Nắng, nhiệt độ 25°C, độ ẩm 65%', '3.5', '10', 'Đạt', '4.0', '10', 'Đạt', '3.8', '10', 'Đạt', '2.1', 'Đạt'),
    (2, '2025-01-10', 'Nắng, nhiệt độ 25°C, độ ẩm 65%', '4.2', '10', 'Đạt', '3.9', '10', 'Đạt', '4.5', '10', 'Đạt', '2.5', 'Đạt'),
    (3, '2025-01-11', 'Nhiều mây, nhiệt độ 22°C, độ ẩm 75%', '5.0', '10', 'Đạt', '4.8', '10', 'Đạt', '5.2', '10', 'Đạt', '3.0', 'Đạt'),
    (4, '2025-01-11', 'Nhiều mây, nhiệt độ 22°C, độ ẩm 75%', '6.5', '10', 'Đạt', '7.0', '10', 'Đạt', '6.8', '10', 'Đạt', '3.5', 'Đạt'),
    (1, '2025-07-15', 'Sau mưa, nhiệt độ 30°C, độ ẩm 85%', '3.2', '10', 'Đạt', '3.5', '10', 'Đạt', '3.0', '10', 'Đạt', '1.8', 'Đạt');

-- ============================================================================
-- Sample Weapons (Vũ khí trang bị)
-- ============================================================================
INSERT INTO weapons (name, classification, unit_measure, quantity, country, year, assigned_unit, assigned_individual) VALUES
    ('Súng trường tấn công AK-47', 'Cấp 1', 'Khẩu', 25, 'Nga', 1990, 15, 10),
    ('Súng ngắn K54', 'Cấp 1', 'Khẩu', 10, 'Trung Quốc', 1995, 5, 5),
    ('Súng trường M16A2', 'Cấp 1', 'Khẩu', 8, 'Mỹ', 2000, 5, 3),
    ('Ống nhòm quân sự 8x42', 'Cấp 2', 'Chiếc', 15, 'Đức', 2018, 10, 5),
    ('Áo giáp chống đạn Level III', 'Cấp 1', 'Bộ', 30, 'Việt Nam', 2020, 20, 10),
    ('Mũ chống đạn', 'Cấp 2', 'Chiếc', 40, 'Việt Nam', 2021, 30, 10),
    ('Dao đa năng quân dụng', 'Cấp 3', 'Chiếc', 50, 'Việt Nam', 2022, 30, 20);

-- ============================================================================
-- Sample Tech Equipment (Trang thiết bị kỹ thuật)
-- ============================================================================
INSERT INTO tech_equipment (name, classification, unit_measure, quantity, country, year, allocation, repair, operating_hours) VALUES
    ('Máy dò mìn AN-19/2', 'Cấp 1', 'Bộ', 5, 'Nga', 2015, 5, '', 1250.5),
    ('Máy rà phá bom mìn cầm tay CEIA MIL-D1', 'Cấp 1', 'Bộ', 3, 'Ý', 2019, 3, '', 890.0),
    ('Thiết bị đo từ trường Geometrics G-858', 'Cấp 1', 'Bộ', 2, 'Mỹ', 2020, 2, 'Đang sửa', 450.0),
    ('Thiết bị GPS cầm tay Garmin 66sr', 'Cấp 2', 'Chiếc', 10, 'Mỹ', 2022, 10, '', 2100.0),
    ('Máy phát điện Honda EU22i', 'Cấp 2', 'Chiếc', 4, 'Nhật Bản', 2021, 4, '', 3500.0),
    ('Thiết bị kiểm định chất lượng QC-100', 'Cấp 2', 'Bộ', 2, 'Hàn Quốc', 2023, 2, '', 120.0),
    ('Máy bơm nước Pentax', 'Cấp 3', 'Chiếc', 3, 'Ý', 2018, 3, 'Đã sửa', 5200.0);

-- ============================================================================
-- Sample Vehicles (Phương tiện)
-- ============================================================================
INSERT INTO vehicles (name, classification, brand, vehicle_type, country, year, allocation, repair, operating_hours, km) VALUES
    ('Toyota Land Cruiser 76', 'Cấp 1', 'Toyota', 'Ô tô', 'Nhật Bản', 2018, 1, '', 2500.0, 45000.0),
    ('Hyundai HD72 tải nhẹ', 'Cấp 2', 'Hyundai', 'Xe tải', 'Hàn Quốc', 2019, 1, '', 3200.0, 62000.0),
    ('Isuzu NQR75LE', 'Cấp 2', 'Isuzu', 'Xe tải', 'Nhật Bản', 2017, 1, 'Đang sửa', 4100.0, 78000.0),
    ('Toyota Hilux 2.4L', 'Cấp 1', 'Toyota', 'Ô tô', 'Thái Lan', 2021, 1, '', 1800.0, 32000.0),
    ('Xe cần cẩu Tadano TM-ZE364MH', 'Cấp 1', 'Tadano', 'Xe chuyên dụng', 'Nhật Bản', 2016, 1, '', 1500.0, 25000.0),
    ('Xe máy Honda Wave RSX', 'Cấp 3', 'Honda', 'Xe máy', 'Việt Nam', 2022, 3, '', 800.0, 15000.0);

-- ============================================================================
-- Sample Materials (Vật tư)
-- ============================================================================
INSERT INTO materials (name, classification, unit_measure, quantity, country, year, assigned_unit, assigned_individual) VALUES
    ('Pin lithium CR123A 3V', 'Cấp 2', 'Viên', 500, 'Nhật Bản', 2024, 400, 100),
    ('Dây tín hiệu đồng trục 5m', 'Cấp 2', 'Cuộn', 100, 'Việt Nam', 2024, 80, 20),
    ('Dầu nhớt tổng hợp 5W-30', 'Cấp 3', 'Lít', 200, 'Nhật Bản', 2024, 200, 0),
    ('Lọc dầu Toyota chính hãng', 'Cấp 3', 'Cái', 30, 'Nhật Bản', 2024, 30, 0),
    ('Găng tay chống cắt Level 5', 'Cấp 2', 'Đôi', 100, 'Việt Nam', 2023, 70, 30),
    ('Kính bảo hộ chống UV', 'Cấp 3', 'Chiếc', 50, 'Việt Nam', 2023, 35, 15),
    ('Bộ dụng cụ sửa chữa đa năng', 'Cấp 2', 'Bộ', 20, 'Đức', 2022, 15, 5),
    ('Băng keo cách điện 3M', 'Cấp 3', 'Cuộn', 200, 'Mỹ', 2024, 150, 50),
    ('Dây thép gai D14', 'Cấp 3', 'Cuộn', 50, 'Việt Nam', 2023, 50, 0),
    ('Sơn chống rỉ Jotun', 'Cấp 3', 'Lít', 100, 'Na Uy', 2024, 100, 0);
