-- ============================================================================
-- DATABASE SCHEMA: QUẢN LÝ KỸ THUẬT (Technical Management)
-- ============================================================================
-- Database Engine: MySQL 8.4.8
-- Generated from: "Phân tích phần mềm quản lý kỹ thuật.docx"
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- 0. ENUM CONSTANTS (Centralized lookup for constant values)
-- ============================================================================
CREATE TABLE IF NOT EXISTS enum_constants (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    enum        VARCHAR(255) NOT NULL,
    type        VARCHAR(100) NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_enum_constants_type_enum (type, enum)
);

INSERT IGNORE INTO enum_constants (enum, type) VALUES
    ('Thiếu úy', 'staff_rank'),
    ('Trung úy', 'staff_rank'),
    ('Thượng uý', 'staff_rank'),
    ('Đại úy', 'staff_rank'),
    ('Thiếu tá', 'staff_rank'),
    ('Trung tá', 'staff_rank'),
    ('Thượng tá', 'staff_rank'),
    ('Đại tá', 'staff_rank'),
    ('Thiếu úy CN', 'staff_rank'),
    ('Trung úy CN', 'staff_rank'),
    ('Thượng uý CN', 'staff_rank'),
    ('Đại úy CN', 'staff_rank'),
    ('Thiếu tá CN', 'staff_rank'),
    ('Trung tá CN', 'staff_rank'),
    ('', 'staff_education'),
    ('Sơ cấp', 'staff_education'),
    ('Trung cấp', 'staff_education'),
    ('Cao đẳng', 'staff_education'),
    ('Đại học', 'staff_education'),
    ('Thạc sĩ', 'staff_education'),
    ('Khác', 'staff_education'),
    ('image/jpeg', 'warehouse_image_file_type'),
    ('image/png', 'warehouse_image_file_type'),
    ('', 'repair_status'),
    ('Chưa sửa', 'repair_status'),
    ('Đang sửa', 'repair_status'),
    ('Đã sửa', 'repair_status');

-- ============================================================================
-- 1. USERS (Authentication)
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(255) NOT NULL UNIQUE,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    full_name   VARCHAR(255) NOT NULL,
    role        VARCHAR(255) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'readonly')),
    status      VARCHAR(255) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved')),
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- ============================================================================
-- 2. UNIT INFO (Thông tin đơn vị) - singleton row
-- ============================================================================
CREATE TABLE IF NOT EXISTS unit_infos (
    id                  TINYINT UNSIGNED NOT NULL DEFAULT 1 PRIMARY KEY CHECK (id = 1),
    unit_name           VARCHAR(255) NOT NULL DEFAULT 'TRUNG TÂM CÔNG NGHỆ XỬ LÝ BOM MÌN',
    technical_officer   VARCHAR(255) NOT NULL DEFAULT '',
    statistician        VARCHAR(255) NOT NULL DEFAULT ''
);

INSERT IGNORE INTO unit_infos (id) VALUES (1);

-- ============================================================================
-- 3. OVERVIEW (Tổng quan khu kỹ thuật) - singleton row
-- ============================================================================
CREATE TABLE IF NOT EXISTS overviews (
    id                  TINYINT UNSIGNED NOT NULL DEFAULT 1 PRIMARY KEY CHECK (id = 1),
    position            VARCHAR(255) NOT NULL DEFAULT '',
    area                VARCHAR(255) NOT NULL DEFAULT '',
    warehouse_system    VARCHAR(255) NOT NULL DEFAULT '',
    fence_system        VARCHAR(255) NOT NULL DEFAULT '',
    road_system         VARCHAR(255) NOT NULL DEFAULT '',
    fire_system         VARCHAR(255) NOT NULL DEFAULT '',
    terrain_map         VARCHAR(255) NOT NULL DEFAULT '',
    land_certificate    VARCHAR(255) NOT NULL DEFAULT ''
);

INSERT IGNORE INTO overviews (id) VALUES (1);

-- ============================================================================
-- 4. staffs (Danh sách cán bộ, chuyên môn kỹ thuật)
-- Section I of the document
-- ============================================================================
-- Constraints from document:
--   - full_name: NOT NULL (Không được để trống)
--   - date_of_birth: Must not be greater than current date
--   - id_number (CMTQĐ/CCCD): NOT NULL (Không được để trống)
--   - rank: Required selection (Bắt buộc chọn)
--   - Warehouse assignment: Required (can be added later)
-- ============================================================================
CREATE TABLE IF NOT EXISTS staffs (
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    full_name           VARCHAR(255) NOT NULL CHECK (length(trim(full_name)) > 0),
    date_of_birth       DATE DEFAULT NULL,
    id_number           VARCHAR(255) NOT NULL CHECK (length(trim(id_number)) > 0),
    rank_id             BIGINT UNSIGNED NOT NULL,
    position            VARCHAR(255) NOT NULL DEFAULT '',
    unit_department     VARCHAR(255) NOT NULL DEFAULT '',
    education_id        BIGINT UNSIGNED NOT NULL,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (rank_id) REFERENCES enum_constants(id),
    FOREIGN KEY (education_id) REFERENCES enum_constants(id)
);




CREATE INDEX idx_staff_full_name ON staffs(full_name);
CREATE INDEX idx_staff_rank_id ON staffs(rank_id);
CREATE INDEX idx_staff_unit_department ON staffs(unit_department);

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
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    code                VARCHAR(255) NOT NULL CHECK (length(trim(code)) > 0),
    function_desc       VARCHAR(255) NOT NULL CHECK (length(trim(function_desc)) > 0),
    keeper              VARCHAR(255) NOT NULL DEFAULT '',
    managing_unit       VARCHAR(255) NOT NULL DEFAULT '',
    area                VARCHAR(255) NOT NULL DEFAULT '',
    construction_date   VARCHAR(255) NOT NULL DEFAULT '',
    notes               VARCHAR(255) NOT NULL DEFAULT '',
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE INDEX idx_warehouses_code ON warehouses(code);
CREATE INDEX idx_warehouses_managing_unit ON warehouses(managing_unit);

-- ============================================================================
-- 5a. WAREHOUSE IMAGES (Hình ảnh kho/trạm/xưởng)
-- Tab: Tổng quan - allows multiple images per warehouse
-- ============================================================================
CREATE TABLE IF NOT EXISTS warehouse_images (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    warehouse_id    BIGINT UNSIGNED NOT NULL,
    file_path       VARCHAR(255) NOT NULL CHECK (length(trim(file_path)) > 0),
    file_type_id    BIGINT UNSIGNED NOT NULL,
    description     VARCHAR(255) NOT NULL DEFAULT '',
    uploaded_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
    FOREIGN KEY (file_type_id) REFERENCES enum_constants(id)
);

CREATE INDEX idx_warehouse_images_warehouse_id ON warehouse_images(warehouse_id);

-- ============================================================================
-- 5b. WAREHOUSE EQUIPMENT (Trang bị, vật tư trong kho)
-- Tab: Trang bị, Vật tư
-- ============================================================================
CREATE TABLE IF NOT EXISTS warehouse_equipments (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    warehouse_id    BIGINT UNSIGNED NOT NULL,
    name            VARCHAR(255) NOT NULL DEFAULT '',
    model           VARCHAR(255) NOT NULL DEFAULT '',
    country         VARCHAR(255) NOT NULL DEFAULT '',
    certification   VARCHAR(255) NOT NULL DEFAULT '',
    maintenance     VARCHAR(255) NOT NULL DEFAULT '',
    import_export   VARCHAR(255) NOT NULL DEFAULT '',
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

CREATE INDEX idx_warehouse_equipments_warehouse_id ON warehouse_equipments(warehouse_id);

-- ============================================================================
-- 5c. WAREHOUSE INSPECTIONS (Kiểm tra kho trạm xưởng)
-- Tab: Kiểm tra kho trạm xưởng
-- ============================================================================
CREATE TABLE IF NOT EXISTS warehouse_inspections (
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    warehouse_id        BIGINT UNSIGNED NOT NULL,
    date                VARCHAR(255) NOT NULL DEFAULT '',
    inspector_name      VARCHAR(255) NOT NULL DEFAULT '',
    inspector_position  VARCHAR(255) NOT NULL DEFAULT '',
    content             VARCHAR(255) NOT NULL DEFAULT '',
    evaluation          VARCHAR(255) NOT NULL DEFAULT '',
    requirements        VARCHAR(255) NOT NULL DEFAULT '',
    server_name         VARCHAR(255) NOT NULL DEFAULT '',
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

CREATE INDEX idx_warehouse_inspections_warehouse_id ON warehouse_inspections(warehouse_id);
CREATE INDEX idx_warehouse_inspections_date ON warehouse_inspections(date);

-- ============================================================================
-- 5d. WAREHOUSE ACCESS (Đăng ký ra vào kho trạm xưởng)
-- Tab: Đăng ký ra vào
-- ============================================================================
CREATE TABLE IF NOT EXISTS warehouse_accesses (
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    warehouse_id        BIGINT UNSIGNED NOT NULL,
    date                VARCHAR(255) NOT NULL DEFAULT '',
    visitor_name        VARCHAR(255) NOT NULL DEFAULT '',
    companion_count     INT NOT NULL DEFAULT 0 CHECK (companion_count >= 0),
    unit                VARCHAR(255) NOT NULL DEFAULT '',
    responsible_person  VARCHAR(255) NOT NULL DEFAULT '',
    time_in             VARCHAR(255) NOT NULL DEFAULT '',
    time_out            VARCHAR(255) NOT NULL DEFAULT '',
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

CREATE INDEX idx_warehouse_accesses_warehouse_id ON warehouse_accesses(warehouse_id);
CREATE INDEX idx_warehouse_accesses_date ON warehouse_accesses(date);

-- ============================================================================
-- 5e. WAREHOUSE HANDOVER (Giao nhận tạm thời)
-- Tab: Giao nhận tạm thời
-- ============================================================================
CREATE TABLE IF NOT EXISTS warehouse_handovers (
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    warehouse_id        BIGINT UNSIGNED NOT NULL,
    equipment_name      VARCHAR(255) NOT NULL DEFAULT '',
    unit                VARCHAR(255) NOT NULL DEFAULT '',
    handover_date       VARCHAR(255) NOT NULL DEFAULT '',
    quality_level       VARCHAR(255) NOT NULL DEFAULT '',
    quantity            INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    giver               VARCHAR(255) NOT NULL DEFAULT '',
    receiver            VARCHAR(255) NOT NULL DEFAULT '',
    return_date         VARCHAR(255) NOT NULL DEFAULT '',
    return_quality      VARCHAR(255) NOT NULL DEFAULT '',
    return_quantity     INT NOT NULL DEFAULT 0 CHECK (return_quantity >= 0),
    return_giver        VARCHAR(255) NOT NULL DEFAULT '',
    return_receiver     VARCHAR(255) NOT NULL DEFAULT '',
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

CREATE INDEX idx_warehouse_handovers_warehouse_id ON warehouse_handovers(warehouse_id);

-- ============================================================================
-- 5f. WAREHOUSE EXPORTS (Xuất kho)
-- Tab: Xuất kho
-- ============================================================================
CREATE TABLE IF NOT EXISTS warehouse_exports (
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    warehouse_id        BIGINT UNSIGNED NOT NULL,
    receiver_name       VARCHAR(255) NOT NULL DEFAULT '',
    receiver_unit       VARCHAR(255) NOT NULL DEFAULT '',
    reason              VARCHAR(255) NOT NULL DEFAULT '',
    item_name           VARCHAR(255) NOT NULL DEFAULT '',
    unit_measure        VARCHAR(255) NOT NULL DEFAULT '',
    required_quantity   DECIMAL(15,2) NOT NULL DEFAULT 0 CHECK (required_quantity >= 0),
    actual_quantity     DECIMAL(15,2) NOT NULL DEFAULT 0 CHECK (actual_quantity >= 0),
    unit_price          DECIMAL(15,2) NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
    total_price         DECIMAL(15,2) NOT NULL DEFAULT 0 CHECK (total_price >= 0),
    notes               VARCHAR(255) NOT NULL DEFAULT '',
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

CREATE INDEX idx_warehouse_exports_warehouse_id ON warehouse_exports(warehouse_id);

-- ============================================================================
-- 5g. WAREHOUSE IMPORTS (Nhập kho)
-- Tab: Nhập kho
-- ============================================================================
CREATE TABLE IF NOT EXISTS warehouse_imports (
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    warehouse_id        BIGINT UNSIGNED NOT NULL,
    sender_name         VARCHAR(255) NOT NULL DEFAULT '',
    sender_unit         VARCHAR(255) NOT NULL DEFAULT '',
    reason              VARCHAR(255) NOT NULL DEFAULT '',
    item_name           VARCHAR(255) NOT NULL DEFAULT '',
    unit_measure        VARCHAR(255) NOT NULL DEFAULT '',
    required_quantity   DECIMAL(15,2) NOT NULL DEFAULT 0 CHECK (required_quantity >= 0),
    actual_quantity     DECIMAL(15,2) NOT NULL DEFAULT 0 CHECK (actual_quantity >= 0),
    unit_price          DECIMAL(15,2) NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
    total_price         DECIMAL(15,2) NOT NULL DEFAULT 0 CHECK (total_price >= 0),
    notes               VARCHAR(255) NOT NULL DEFAULT '',
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

CREATE INDEX idx_warehouse_imports_warehouse_id ON warehouse_imports(warehouse_id);

-- ============================================================================
-- 5h. WAREHOUSE LIGHTNING (Chống sét)
-- Tab: Chống sét
-- ============================================================================
CREATE TABLE IF NOT EXISTS warehouse_lightnings (
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    warehouse_id        BIGINT UNSIGNED NOT NULL,
    date                VARCHAR(255) NOT NULL DEFAULT '',
    weather             VARCHAR(255) NOT NULL DEFAULT '',
    direct_rod1_rdo     VARCHAR(255) NOT NULL DEFAULT '',
    direct_rod1_rxk     VARCHAR(255) NOT NULL DEFAULT '',
    direct_rod1_result  VARCHAR(255) NOT NULL DEFAULT '',
    direct_rod2_rdo     VARCHAR(255) NOT NULL DEFAULT '',
    direct_rod2_rxk     VARCHAR(255) NOT NULL DEFAULT '',
    direct_rod2_result  VARCHAR(255) NOT NULL DEFAULT '',
    direct_rod3_rdo     VARCHAR(255) NOT NULL DEFAULT '',
    direct_rod3_rxk     VARCHAR(255) NOT NULL DEFAULT '',
    direct_rod3_result  VARCHAR(255) NOT NULL DEFAULT '',
    induction_rdo       VARCHAR(255) NOT NULL DEFAULT '',
    induction_result    VARCHAR(255) NOT NULL DEFAULT '',
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

CREATE INDEX idx_warehouse_lightnings_warehouse_id ON warehouse_lightnings(warehouse_id);

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
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name                VARCHAR(255) NOT NULL CHECK (length(trim(name)) > 0),
    classification      VARCHAR(255) NOT NULL DEFAULT '',
    unit_measure        VARCHAR(255) NOT NULL DEFAULT '',
    quantity            INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    country             VARCHAR(255) NOT NULL DEFAULT '',
    year                INT DEFAULT NULL,
    assigned_unit       INT NOT NULL DEFAULT 0 CHECK (assigned_unit >= 0),
    assigned_individual INT NOT NULL DEFAULT 0 CHECK (assigned_individual >= 0),
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (year IS NULL OR year >= 1900),
    CHECK (assigned_unit + assigned_individual <= quantity)
);




CREATE INDEX idx_weapons_name ON weapons(name);
CREATE INDEX idx_weapons_classification ON weapons(classification);

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
CREATE TABLE IF NOT EXISTS tech_equipments (
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name                VARCHAR(255) NOT NULL CHECK (length(trim(name)) > 0),
    classification      VARCHAR(255) NOT NULL DEFAULT '',
    unit_measure        VARCHAR(255) NOT NULL DEFAULT '',
    quantity            INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    country             VARCHAR(255) NOT NULL DEFAULT '',
    year                INT DEFAULT NULL,
    allocation          INT NOT NULL DEFAULT 0 CHECK (allocation >= 0),
    repair_id           BIGINT UNSIGNED NOT NULL,
    operating_hours     DECIMAL(15,2) NOT NULL DEFAULT 0 CHECK (operating_hours >= 0),
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (year IS NULL OR year >= 1900),
    CHECK (allocation <= quantity),
    FOREIGN KEY (repair_id) REFERENCES enum_constants(id)
);




CREATE INDEX idx_tech_equipment_name ON tech_equipments(name);
CREATE INDEX idx_tech_equipment_classification ON tech_equipments(classification);

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
--   - Document does not define a vehicle quantity field, so allocation has
--     non-negative validation only (no allocation<=quantity check)
-- ============================================================================
CREATE TABLE IF NOT EXISTS vehicles (
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name                VARCHAR(255) NOT NULL CHECK (length(trim(name)) > 0),
    classification      VARCHAR(255) NOT NULL DEFAULT '',
    brand               VARCHAR(255) NOT NULL DEFAULT '',
    vehicle_type        VARCHAR(255) NOT NULL DEFAULT '',
    country             VARCHAR(255) NOT NULL DEFAULT '',
    year                INT DEFAULT NULL,
    allocation          INT NOT NULL DEFAULT 0 CHECK (allocation >= 0),
    repair_id           BIGINT UNSIGNED NOT NULL,
    operating_hours     DECIMAL(15,2) NOT NULL DEFAULT 0 CHECK (operating_hours >= 0),
    km                  DECIMAL(15,2) NOT NULL DEFAULT 0 CHECK (km >= 0),
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (year IS NULL OR year >= 1900),
    FOREIGN KEY (repair_id) REFERENCES enum_constants(id)
);




CREATE INDEX idx_vehicles_name ON vehicles(name);
CREATE INDEX idx_vehicles_brand ON vehicles(brand);
CREATE INDEX idx_vehicles_vehicle_type ON vehicles(vehicle_type);

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
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name                VARCHAR(255) NOT NULL CHECK (length(trim(name)) > 0),
    classification      VARCHAR(255) NOT NULL DEFAULT '',
    unit_measure        VARCHAR(255) NOT NULL DEFAULT '',
    quantity            INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    country             VARCHAR(255) NOT NULL DEFAULT '',
    year                INT DEFAULT NULL,
    assigned_unit       INT NOT NULL DEFAULT 0 CHECK (assigned_unit >= 0),
    assigned_individual INT NOT NULL DEFAULT 0 CHECK (assigned_individual >= 0),
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (year IS NULL OR year >= 1900),
    CHECK (assigned_unit + assigned_individual <= quantity)
);




CREATE INDEX idx_materials_name ON materials(name);
CREATE INDEX idx_materials_classification ON materials(classification);

-- ============================================================================
-- 10. staffs ASSIGNMENTS (Many-to-many with assigned entities)
-- ============================================================================
CREATE TABLE IF NOT EXISTS staff_warehouses (
    id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    staff_id         BIGINT UNSIGNED NULL,
    staff_name       VARCHAR(255) NULL,
    warehouse_id     BIGINT UNSIGNED NULL,
    warehouse_code   VARCHAR(255) NULL,
    staff_key        VARCHAR(300) GENERATED ALWAYS AS (
                        CASE
                            WHEN staff_id IS NOT NULL THEN CONCAT('ID:', staff_id)
                            ELSE CONCAT('NAME:', lower(trim(staff_name)))
                        END
                    ) STORED,
    warehouse_key    VARCHAR(300) GENERATED ALWAYS AS (
                        CASE
                            WHEN warehouse_id IS NOT NULL THEN CONCAT('ID:', warehouse_id)
                            ELSE CONCAT('CODE:', lower(trim(warehouse_code)))
                        END
                    ) STORED,
    assigned_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staffs(id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
    UNIQUE KEY uq_staff_warehouses_assignment (staff_key, warehouse_key),
    CHECK (
        staff_id IS NOT NULL OR (staff_name IS NOT NULL AND length(trim(staff_name)) > 0)
    ),
    CHECK (
        warehouse_id IS NOT NULL OR (warehouse_code IS NOT NULL AND length(trim(warehouse_code)) > 0)
    )
);

CREATE TABLE IF NOT EXISTS staff_weapons (
    id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    staff_id         BIGINT UNSIGNED NULL,
    staff_name       VARCHAR(255) NULL,
    weapon_id        BIGINT UNSIGNED NULL,
    weapon_name      VARCHAR(255) NULL,
    staff_key        VARCHAR(300) GENERATED ALWAYS AS (
                        CASE
                            WHEN staff_id IS NOT NULL THEN CONCAT('ID:', staff_id)
                            ELSE CONCAT('NAME:', lower(trim(staff_name)))
                        END
                    ) STORED,
    weapon_key       VARCHAR(300) GENERATED ALWAYS AS (
                        CASE
                            WHEN weapon_id IS NOT NULL THEN CONCAT('ID:', weapon_id)
                            ELSE CONCAT('NAME:', lower(trim(weapon_name)))
                        END
                    ) STORED,
    assigned_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staffs(id),
    FOREIGN KEY (weapon_id) REFERENCES weapons(id),
    UNIQUE KEY uq_staff_weapons_assignment (staff_key, weapon_key),
    CHECK (
        staff_id IS NOT NULL OR (staff_name IS NOT NULL AND length(trim(staff_name)) > 0)
    ),
    CHECK (
        weapon_id IS NOT NULL OR (weapon_name IS NOT NULL AND length(trim(weapon_name)) > 0)
    )
);

CREATE TABLE IF NOT EXISTS staff_vehicles (
    id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    staff_id         BIGINT UNSIGNED NULL,
    staff_name       VARCHAR(255) NULL,
    vehicle_id       BIGINT UNSIGNED NULL,
    vehicle_name     VARCHAR(255) NULL,
    staff_key        VARCHAR(300) GENERATED ALWAYS AS (
                        CASE
                            WHEN staff_id IS NOT NULL THEN CONCAT('ID:', staff_id)
                            ELSE CONCAT('NAME:', lower(trim(staff_name)))
                        END
                    ) STORED,
    vehicle_key      VARCHAR(300) GENERATED ALWAYS AS (
                        CASE
                            WHEN vehicle_id IS NOT NULL THEN CONCAT('ID:', vehicle_id)
                            ELSE CONCAT('NAME:', lower(trim(vehicle_name)))
                        END
                    ) STORED,
    assigned_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staffs(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    UNIQUE KEY uq_staff_vehicles_assignment (staff_key, vehicle_key),
    CHECK (
        staff_id IS NOT NULL OR (staff_name IS NOT NULL AND length(trim(staff_name)) > 0)
    ),
    CHECK (
        vehicle_id IS NOT NULL OR (vehicle_name IS NOT NULL AND length(trim(vehicle_name)) > 0)
    )
);

CREATE TABLE IF NOT EXISTS staff_tech_equipment (
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    staff_id             BIGINT UNSIGNED NULL,
    staff_name           VARCHAR(255) NULL,
    tech_equipment_id    BIGINT UNSIGNED NULL,
    tech_equipment_name  VARCHAR(255) NULL,
    staff_key            VARCHAR(300) GENERATED ALWAYS AS (
                            CASE
                                WHEN staff_id IS NOT NULL THEN CONCAT('ID:', staff_id)
                                ELSE CONCAT('NAME:', lower(trim(staff_name)))
                            END
                        ) STORED,
    tech_equipment_key   VARCHAR(300) GENERATED ALWAYS AS (
                            CASE 
                                WHEN tech_equipment_id IS NOT NULL THEN CONCAT('ID:', tech_equipment_id)
                                ELSE CONCAT('NAME:', lower(trim(tech_equipment_name)))
                            END
                        ) STORED,
    assigned_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staffs(id),
    FOREIGN KEY (tech_equipment_id) REFERENCES tech_equipments(id),
    UNIQUE KEY uq_staff_tech_equipment_assignment (staff_key, tech_equipment_key),
    CHECK (
        staff_id IS NOT NULL OR (staff_name IS NOT NULL AND length(trim(staff_name)) > 0)
    ),
    CHECK (
        tech_equipment_id IS NOT NULL OR (tech_equipment_name IS NOT NULL AND length(trim(tech_equipment_name)) > 0)
    )
);


-- ============================================================================
-- ============================================================================
-- SAMPLE DATA INSERTION
-- ============================================================================
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- Sample Users
-- ============================================================================
-- Note: Passwords should be bcrypt-hashed in production. The values below are
-- placeholder hashes for illustration only.
INSERT INTO users (username, email, password, full_name, role, status) VALUES
    (
        'admin',
        'thanhpxd49@gmail.com',
        '$2b$10$5s0AEt6NNwaZZ0IL5g7GPunT33kSeEQykpsmbgomQwsdeTeQNfs7K',
        'Quản Trị Viên',
        'admin',
        'approved'
    ),
    (
        'nvkt01',
        'nvkt01@quanlykythuat.vn',
        '$2b$10$examplehashforpassword1234567890abcde',
        'Nguyễn Văn An',
        'user',
        'approved'
    ),
    (
        'nvkt02',
        'nvkt02@quanlykythuat.vn',
        '$2b$10$examplehashforpassword1234567890abcde',
        'Trần Thị Bình',
        'readonly',
        'approved'
    );

-- ============================================================================
-- Sample Unit Info
-- ============================================================================
UPDATE unit_infos SET
    unit_name = 'TRUNG TÂM CÔNG NGHỆ XỬ LÝ BOM MÌN',
    technical_officer = 'Đại tá Nguyễn Văn Hùng',
    statistician = 'Thiếu tá Trần Văn Minh'
WHERE id = 1;

-- ============================================================================
-- Sample Overview
-- ============================================================================
UPDATE overviews SET
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
-- Sample staffs (Danh sách cán bộ kỹ thuật)
-- ============================================================================
INSERT INTO staffs (full_name, date_of_birth, id_number, rank_id, position, unit_department, education_id) VALUES
    (
        'Nguyễn Văn Hùng',
        '1975-03-15',
        'QĐ-001234',
        (SELECT id FROM enum_constants WHERE type = 'staff_rank' AND enum = 'Đại tá'),
        'Giám đốc Trung tâm',
        'Cụm bộ',
        (SELECT id FROM enum_constants WHERE type = 'staff_education' AND enum = 'Đại học')
    ),
    (
        'Trần Văn Minh',
        '1980-07-22',
        'QĐ-002345',
        (SELECT id FROM enum_constants WHERE type = 'staff_rank' AND enum = 'Thiếu tá'),
        'Phó Giám đốc',
        'Cụm bộ',
        (SELECT id FROM enum_constants WHERE type = 'staff_education' AND enum = 'Thạc sĩ')
    ),
    (
        'Lê Thị Hoa',
        '1985-11-08',
        'QĐ-003456',
        (SELECT id FROM enum_constants WHERE type = 'staff_rank' AND enum = 'Đại úy'),
        'Trưởng phòng Kỹ thuật',
        'Đội Dò tìm',
        (SELECT id FROM enum_constants WHERE type = 'staff_education' AND enum = 'Đại học')
    ),
    (
        'Phạm Đức Anh',
        '1988-05-30',
        'QĐ-004567',
        (SELECT id FROM enum_constants WHERE type = 'staff_rank' AND enum = 'Thượng uý'),
        'Nhân viên kỹ thuật',
        'Đội Dò tìm',
        (SELECT id FROM enum_constants WHERE type = 'staff_education' AND enum = 'Cao đẳng')
    ),
    (
        'Hoàng Minh Tuấn',
        '1990-01-12',
        'QĐ-005678',
        (SELECT id FROM enum_constants WHERE type = 'staff_rank' AND enum = 'Trung úy'),
        'Thủ kho',
        'Trạm xử lý',
        (SELECT id FROM enum_constants WHERE type = 'staff_education' AND enum = 'Trung cấp')
    ),
    (
        'Vũ Thị Lan',
        '1992-09-25',
        'QĐ-006789',
        (SELECT id FROM enum_constants WHERE type = 'staff_rank' AND enum = 'Thiếu úy'),
        'Nhân viên thống kê',
        'Cụm bộ',
        (SELECT id FROM enum_constants WHERE type = 'staff_education' AND enum = 'Đại học')
    ),
    (
        'Đỗ Quang Hải',
        '1983-04-18',
        'QĐ-007890',
        (SELECT id FROM enum_constants WHERE type = 'staff_rank' AND enum = 'Trung tá'),
        'Đội trưởng Đội Dò tìm',
        'Đội Dò tìm',
        (SELECT id FROM enum_constants WHERE type = 'staff_education' AND enum = 'Đại học')
    ),
    (
        'Bùi Văn Nam',
        '1987-12-05',
        'QĐ-008901',
        (SELECT id FROM enum_constants WHERE type = 'staff_rank' AND enum = 'Đại úy CN'),
        'Kỹ sư cơ khí',
        'Trạm xử lý',
        (SELECT id FROM enum_constants WHERE type = 'staff_education' AND enum = 'Đại học')
    );

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
INSERT INTO warehouse_images (warehouse_id, file_path, file_type_id, description) VALUES
    (1, '/uploads/warehouses/kho-a1-front.jpg', (SELECT id FROM enum_constants WHERE type = 'warehouse_image_file_type' AND enum = 'image/jpeg'), 'Mặt trước Kho A1'),
    (1, '/uploads/warehouses/kho-a1-inside.png', (SELECT id FROM enum_constants WHERE type = 'warehouse_image_file_type' AND enum = 'image/png'), 'Bên trong Kho A1'),
    (2, '/uploads/warehouses/kho-a2-overview.jpg', (SELECT id FROM enum_constants WHERE type = 'warehouse_image_file_type' AND enum = 'image/jpeg'), 'Tổng quan Kho A2'),
    (3, '/uploads/warehouses/kho-b1-equipment.jpg', (SELECT id FROM enum_constants WHERE type = 'warehouse_image_file_type' AND enum = 'image/jpeg'), 'Khu vực thiết bị Kho B1'),
    (5, '/uploads/warehouses/tram-t1-workshop.jpg', (SELECT id FROM enum_constants WHERE type = 'warehouse_image_file_type' AND enum = 'image/jpeg'), 'Xưởng sửa chữa T1');

-- ============================================================================
-- Sample Warehouse Equipment (Trang bị vật tư trong kho)
-- ============================================================================
INSERT INTO warehouse_equipments (warehouse_id, name, model, country, certification, maintenance, import_export) VALUES
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
INSERT INTO warehouse_accesses (warehouse_id, date, visitor_name, companion_count, unit, responsible_person, time_in, time_out) VALUES
    (1, '2025-03-10', 'Phạm Đức Anh', 2, 'Đội Dò tìm', 'Nguyễn Văn Hùng', '08:30', '10:15'),
    (1, '2025-03-12', 'Đỗ Quang Hải', 0, 'Đội Dò tìm', 'Nguyễn Văn Hùng', '14:00', '15:30'),
    (2, '2025-03-15', 'Lê Thị Hoa', 1, 'Đội Dò tìm', 'Trần Văn Minh', '09:00', '11:00'),
    (3, '2025-04-01', 'Phạm Đức Anh', 3, 'Đội Dò tìm', 'Lê Thị Hoa', '07:30', '09:45'),
    (4, '2025-04-05', 'Bùi Văn Nam', 1, 'Trạm xử lý', 'Hoàng Minh Tuấn', '13:00', '16:00');

-- ============================================================================
-- Sample Warehouse Handover (Giao nhận tạm thời)
-- ============================================================================
INSERT INTO warehouse_handovers (warehouse_id, equipment_name, unit, handover_date, quality_level, quantity, giver, receiver, return_date, return_quality, return_quantity, return_giver, return_receiver) VALUES
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
INSERT INTO warehouse_lightnings (warehouse_id, date, weather, direct_rod1_rdo, direct_rod1_rxk, direct_rod1_result, direct_rod2_rdo, direct_rod2_rxk, direct_rod2_result, direct_rod3_rdo, direct_rod3_rxk, direct_rod3_result, induction_rdo, induction_result) VALUES
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
INSERT INTO tech_equipments (name, classification, unit_measure, quantity, country, year, allocation, repair_id, operating_hours) VALUES
    ('Máy dò mìn AN-19/2', 'Cấp 1', 'Bộ', 5, 'Nga', 2015, 5, (SELECT id FROM enum_constants WHERE type = 'repair_status' AND enum = ''), 1250.5),
    ('Máy rà phá bom mìn cầm tay CEIA MIL-D1', 'Cấp 1', 'Bộ', 3, 'Ý', 2019, 3, (SELECT id FROM enum_constants WHERE type = 'repair_status' AND enum = ''), 890.0),
    ('Thiết bị đo từ trường Geometrics G-858', 'Cấp 1', 'Bộ', 2, 'Mỹ', 2020, 2, (SELECT id FROM enum_constants WHERE type = 'repair_status' AND enum = 'Đang sửa'), 450.0),
    ('Thiết bị GPS cầm tay Garmin 66sr', 'Cấp 2', 'Chiếc', 10, 'Mỹ', 2022, 10, (SELECT id FROM enum_constants WHERE type = 'repair_status' AND enum = ''), 2100.0),
    ('Máy phát điện Honda EU22i', 'Cấp 2', 'Chiếc', 4, 'Nhật Bản', 2021, 4, (SELECT id FROM enum_constants WHERE type = 'repair_status' AND enum = ''), 3500.0),
    ('Thiết bị kiểm định chất lượng QC-100', 'Cấp 2', 'Bộ', 2, 'Hàn Quốc', 2023, 2, (SELECT id FROM enum_constants WHERE type = 'repair_status' AND enum = ''), 120.0),
    ('Máy bơm nước Pentax', 'Cấp 3', 'Chiếc', 3, 'Ý', 2018, 3, (SELECT id FROM enum_constants WHERE type = 'repair_status' AND enum = 'Đã sửa'), 5200.0);

-- ============================================================================
-- Sample Vehicles (Phương tiện)
-- ============================================================================
INSERT INTO vehicles (name, classification, brand, vehicle_type, country, year, allocation, repair_id, operating_hours, km) VALUES
    ('Toyota Land Cruiser 76', 'Cấp 1', 'Toyota', 'Ô tô', 'Nhật Bản', 2018, 1, (SELECT id FROM enum_constants WHERE type = 'repair_status' AND enum = ''), 2500.0, 45000.0),
    ('Hyundai HD72 tải nhẹ', 'Cấp 2', 'Hyundai', 'Xe tải', 'Hàn Quốc', 2019, 1, (SELECT id FROM enum_constants WHERE type = 'repair_status' AND enum = ''), 3200.0, 62000.0),
    ('Isuzu NQR75LE', 'Cấp 2', 'Isuzu', 'Xe tải', 'Nhật Bản', 2017, 1, (SELECT id FROM enum_constants WHERE type = 'repair_status' AND enum = 'Đang sửa'), 4100.0, 78000.0),
    ('Toyota Hilux 2.4L', 'Cấp 1', 'Toyota', 'Ô tô', 'Thái Lan', 2021, 1, (SELECT id FROM enum_constants WHERE type = 'repair_status' AND enum = ''), 1800.0, 32000.0),
    ('Xe cần cẩu Tadano TM-ZE364MH', 'Cấp 1', 'Tadano', 'Xe chuyên dụng', 'Nhật Bản', 2016, 1, (SELECT id FROM enum_constants WHERE type = 'repair_status' AND enum = ''), 1500.0, 25000.0),
    ('Xe máy Honda Wave RSX', 'Cấp 3', 'Honda', 'Xe máy', 'Việt Nam', 2022, 3, (SELECT id FROM enum_constants WHERE type = 'repair_status' AND enum = ''), 800.0, 15000.0);

-- ============================================================================
-- Sample staffs Assignments (Many-to-many mapping)
-- ============================================================================
INSERT INTO staff_warehouses (staff_id, warehouse_id)
SELECT s.id, w.id
FROM staffs s
JOIN warehouses w ON w.code IN ('Kho A1', 'Kho B1')
WHERE s.id_number = 'QĐ-007890';

INSERT INTO staff_warehouses (staff_id, warehouse_id)
SELECT s.id, w.id
FROM staffs s
JOIN warehouses w ON w.code = 'Kho A1'
WHERE s.id_number = 'QĐ-001234';

INSERT INTO staff_warehouses (staff_id, warehouse_id)
SELECT s.id, w.id
FROM staffs s
JOIN warehouses w ON w.code = 'Kho A2'
WHERE s.id_number = 'QĐ-002345';

INSERT INTO staff_warehouses (staff_id, warehouse_id)
SELECT s.id, w.id
FROM staffs s
JOIN warehouses w ON w.code = 'Kho B1'
WHERE s.id_number = 'QĐ-003456';

INSERT INTO staff_warehouses (staff_id, warehouse_id)
SELECT s.id, w.id
FROM staffs s
JOIN warehouses w ON w.code = 'Kho C1'
WHERE s.id_number IN ('QĐ-005678', 'QĐ-008901');

INSERT INTO staff_weapons (staff_id, weapon_id)
SELECT s.id, w.id
FROM staffs s
JOIN weapons w ON w.name LIKE '%AK-47%'
WHERE s.id_number IN ('QĐ-001234', 'QĐ-002345', 'QĐ-004567', 'QĐ-007890');

INSERT INTO staff_weapons (staff_id, weapon_id)
SELECT s.id, w.id
FROM staffs s
JOIN weapons w ON w.name LIKE '%K54%'
WHERE s.id_number IN ('QĐ-001234', 'QĐ-003456');

INSERT INTO staff_weapons (staff_id, weapon_id)
SELECT s.id, w.id
FROM staffs s
JOIN weapons w ON w.name LIKE '%M16A2%'
WHERE s.id_number = 'QĐ-007890';

INSERT INTO staff_vehicles (staff_id, vehicle_id)
SELECT s.id, v.id
FROM staffs s
JOIN vehicles v ON v.name LIKE '%Land Cruiser%'
WHERE s.id_number = 'QĐ-001234';

INSERT INTO staff_vehicles (staff_id, vehicle_id)
SELECT s.id, v.id
FROM staffs s
JOIN vehicles v ON v.name LIKE '%HD72%'
WHERE s.id_number = 'QĐ-002345';

INSERT INTO staff_vehicles (staff_id, vehicle_id)
SELECT s.id, v.id
FROM staffs s
JOIN vehicles v ON v.name LIKE '%NQR75LE%'
WHERE s.id_number = 'QĐ-004567';

INSERT INTO staff_vehicles (staff_id, vehicle_id)
SELECT s.id, v.id
FROM staffs s
JOIN vehicles v ON v.name LIKE '%Hilux%'
WHERE s.id_number = 'QĐ-007890';

INSERT INTO staff_vehicles (staff_id, vehicle_id)
SELECT s.id, v.id
FROM staffs s
JOIN vehicles v ON v.name LIKE '%Tadano%'
WHERE s.id_number = 'QĐ-008901';

INSERT INTO staff_tech_equipment (staff_id, tech_equipment_id)
SELECT s.id, t.id
FROM staffs s
JOIN tech_equipments t ON t.name LIKE '%AN-19/2%'
WHERE s.id_number IN ('QĐ-001234', 'QĐ-007890');

INSERT INTO staff_tech_equipment (staff_id, tech_equipment_id)
SELECT s.id, t.id
FROM staffs s
JOIN tech_equipments t ON t.name LIKE '%CEIA MIL-D1%'
WHERE s.id_number = 'QĐ-002345';

INSERT INTO staff_tech_equipment (staff_id, tech_equipment_id)
SELECT s.id, t.id
FROM staffs s
JOIN tech_equipments t ON t.name LIKE '%Geometrics G-858%'
WHERE s.id_number = 'QĐ-003456';

INSERT INTO staff_tech_equipment (staff_id, tech_equipment_id)
SELECT s.id, t.id
FROM staffs s
JOIN tech_equipments t ON t.name LIKE '%QC-100%'
WHERE s.id_number = 'QĐ-005678';

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
