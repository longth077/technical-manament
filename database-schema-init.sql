-- ============================================================================
-- DATABASE SCHEMA: QUẢN LÝ KỸ THUẬT (Technical Management)
-- ============================================================================
-- Database Engine: MySQL 8.4.8
-- Init-only version: contains table definitions + enum constants + admin account
-- No sample data.
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
-- 4. STAFFS (Danh sách cán bộ, chuyên môn kỹ thuật)
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
-- ============================================================================
CREATE TABLE IF NOT EXISTS warehouses (
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    code                VARCHAR(255) NOT NULL CHECK (length(trim(code)) > 0),
    function_desc       VARCHAR(255) NOT NULL CHECK (length(trim(function_desc)) > 0),
    keeper_id           BIGINT UNSIGNED NULL,
    managing_unit       VARCHAR(255) NOT NULL DEFAULT '',
    area                VARCHAR(255) NOT NULL DEFAULT '',
    construction_date   VARCHAR(255) NOT NULL DEFAULT '',
    notes               VARCHAR(255) NOT NULL DEFAULT '',
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (keeper_id) REFERENCES staffs(id) ON DELETE SET NULL
);

CREATE INDEX idx_warehouses_code ON warehouses(code);
CREATE INDEX idx_warehouses_managing_unit ON warehouses(managing_unit);

-- ============================================================================
-- 5a. WAREHOUSE IMAGES (Hình ảnh kho/trạm/xưởng)
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
-- 10. STAFF ASSIGNMENTS (Many-to-many with assigned entities)
-- ============================================================================
CREATE TABLE IF NOT EXISTS staff_warehouses (
    id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    staff_id         BIGINT UNSIGNED NULL,
    staff_name       VARCHAR(255) NULL,
    warehouse_id     BIGINT UNSIGNED NULL,
    warehouse_code   VARCHAR(255) NULL,
    is_main_keeper   TINYINT(1) NOT NULL DEFAULT 0,
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
    id                   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
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

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Admin account
-- Username : admin
-- Password : dank4920132018  (bcrypt hash below, cost=10)
-- Note: the application's ensureDefaultAdmin() will re-hash and upsert this
--       row on every startup, so the hash here is only a fallback seed.
INSERT IGNORE INTO users (username, email, password, full_name, role, status) VALUES (
    'admin',
    'thanhpxd49@gmail.com',
    '$2b$10$5s0AEt6NNwaZZ0IL5g7GPunT33kSeEQykpsmbgomQwsdeTeQNfs7K',
    'Quản Trị Viên',
    'admin',
    'approved'
);
