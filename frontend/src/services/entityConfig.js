// Filter fields exposed per entity.
// type 'entity_select' → backend FK exact-match, renders a linked-entity dropdown.
// type 'enum_filter'   → client-side exact-match, renders an enum dropdown.
// type 'text'/'number' → client-side substring match, renders a text input.
export const ENTITY_FILTER_FIELDS = {
  staffs: [
    { key: "full_name", label: "Họ tên", type: "text" },
    { key: "id_number", label: "Số CMTQĐ/CCCD", type: "text" },
    {
      key: "education_id",
      label: "Trình độ",
      type: "enum_filter",
      enumType: "staff_education",
    },
    { key: "position", label: "Chức vụ", type: "text" },
    { key: "date_of_birth", label: "Ngày sinh", type: "text" },
  ],
  warehouses: [
    { key: "code", label: "Mã kho", type: "text" },
    { key: "managing_unit", label: "Đơn vị quản lý", type: "text" },
    { key: "notes", label: "Ghi chú", type: "text" },
  ],
  warehouse_images: [
    {
      key: "warehouse_id",
      label: "Kho",
      type: "entity_select",
      lookupEntity: "warehouses",
      lookupLabelField: "code",
    },
  ],
  warehouse_equipments: [
    {
      key: "warehouse_id",
      label: "Kho",
      type: "entity_select",
      lookupEntity: "warehouses",
      lookupLabelField: "code",
    },
    { key: "name", label: "Tên", type: "text" },
    { key: "model", label: "Mẫu", type: "text" },
    { key: "country", label: "Nước SX", type: "text" },
    { key: "certification", label: "Chứng nhận", type: "text" },
    { key: "maintenance", label: "Bảo dưỡng", type: "text" },
  ],
  warehouse_inspections: [
    {
      key: "warehouse_id",
      label: "Kho",
      type: "entity_select",
      lookupEntity: "warehouses",
      lookupLabelField: "code",
    },
    { key: "date", label: "Ngày", type: "text" },
    { key: "inspector_name", label: "Người kiểm tra", type: "text" },
    { key: "inspector_position", label: "Chức vụ", type: "text" },
    { key: "content", label: "Nội dung", type: "text" },
    { key: "evaluation", label: "Đánh giá", type: "text" },
    { key: "requirements", label: "Yêu cầu", type: "text" },
  ],
  warehouse_accesses: [
    {
      key: "warehouse_id",
      label: "Kho",
      type: "entity_select",
      lookupEntity: "warehouses",
      lookupLabelField: "code",
    },
    { key: "date", label: "Ngày", type: "text" },
    { key: "visitor_name", label: "Tên khách", type: "text" },
    { key: "unit", label: "Đơn vị", type: "text" },
    {
      key: "responsible_person",
      label: "Người chịu trách nhiệm",
      type: "text",
    },
  ],
  warehouse_handovers: [
    {
      key: "warehouse_id",
      label: "Kho",
      type: "entity_select",
      lookupEntity: "warehouses",
      lookupLabelField: "code",
    },
    { key: "equipment_name", label: "Tên trang bị", type: "text" },
    { key: "handover_date", label: "Ngày giao", type: "text" },
    { key: "quality_level", label: "Chất lượng", type: "text" },
    { key: "giver", label: "Người giao", type: "text" },
    { key: "receiver", label: "Người nhận", type: "text" },
    { key: "return_date", label: "Ngày trả", type: "text" },
    { key: "return_giver", label: "Người trả", type: "text" },
    { key: "return_receiver", label: "Người nhận trả", type: "text" },
  ],
  warehouse_exports: [
    {
      key: "warehouse_id",
      label: "Kho",
      type: "entity_select",
      lookupEntity: "warehouses",
      lookupLabelField: "code",
    },
    { key: "receiver_name", label: "Người nhận", type: "text" },
    { key: "receiver_unit", label: "Đơn vị nhận", type: "text" },
    { key: "reason", label: "Lý do", type: "text" },
    { key: "item_name", label: "Tên hàng", type: "text" },
  ],
  warehouse_imports: [
    {
      key: "warehouse_id",
      label: "Kho",
      type: "entity_select",
      lookupEntity: "warehouses",
      lookupLabelField: "code",
    },
    { key: "sender_name", label: "Người giao", type: "text" },
    { key: "sender_unit", label: "Đơn vị giao", type: "text" },
    { key: "reason", label: "Lý do", type: "text" },
    { key: "item_name", label: "Tên hàng", type: "text" },
  ],
  warehouse_lightnings: [
    {
      key: "warehouse_id",
      label: "Kho",
      type: "entity_select",
      lookupEntity: "warehouses",
      lookupLabelField: "code",
    },
    { key: "date", label: "Ngày", type: "text" },
    { key: "weather", label: "Thời tiết", type: "text" },
    { key: "direct_rod1_result", label: "KQ Cọc 1", type: "text" },
    { key: "direct_rod2_result", label: "KQ Cọc 2", type: "text" },
    { key: "direct_rod3_result", label: "KQ Cọc 3", type: "text" },
    { key: "induction_result", label: "KQ Cảm ứng", type: "text" },
  ],
  weapons: [
    { key: "name", label: "Tên", type: "text" },
    { key: "classification", label: "Phân loại", type: "text" },
    { key: "country", label: "Nước SX", type: "text" },
    { key: "year", label: "Năm SX", type: "text" },
  ],
  tech_equipments: [
    { key: "name", label: "Tên", type: "text" },
    { key: "classification", label: "Phân loại", type: "text" },
    { key: "country", label: "Nước SX", type: "text" },
    { key: "year", label: "Năm SX", type: "text" },
  ],
  vehicles: [
    { key: "name", label: "Tên", type: "text" },
    { key: "classification", label: "Phân loại", type: "text" },
    { key: "brand", label: "Nhãn hiệu", type: "text" },
    { key: "vehicle_type", label: "Loại xe", type: "text" },
    { key: "country", label: "Nước SX", type: "text" },
    { key: "year", label: "Năm SX", type: "text" },
  ],
  materials: [
    { key: "name", label: "Tên", type: "text" },
    { key: "classification", label: "Phân loại", type: "text" },
    { key: "country", label: "Nước SX", type: "text" },
    { key: "year", label: "Năm SX", type: "text" },
  ],
  staff_warehouses: [
    {
      key: "staff_id",
      label: "Cán bộ",
      type: "entity_select",
      lookupEntity: "staffs",
      lookupLabelField: "full_name",
    },
    {
      key: "warehouse_id",
      label: "Kho",
      type: "entity_select",
      lookupEntity: "warehouses",
      lookupLabelField: "code",
    },
  ],
  staff_weapons: [
    {
      key: "staff_id",
      label: "Cán bộ",
      type: "entity_select",
      lookupEntity: "staffs",
      lookupLabelField: "full_name",
    },
    {
      key: "weapon_id",
      label: "Vũ khí",
      type: "entity_select",
      lookupEntity: "weapons",
      lookupLabelField: "name",
    },
  ],
  staff_vehicles: [
    {
      key: "staff_id",
      label: "Cán bộ",
      type: "entity_select",
      lookupEntity: "staffs",
      lookupLabelField: "full_name",
    },
    {
      key: "vehicle_id",
      label: "Phương tiện",
      type: "entity_select",
      lookupEntity: "vehicles",
      lookupLabelField: "name",
    },
  ],
  staff_tech_equipment: [
    {
      key: "staff_id",
      label: "Cán bộ",
      type: "entity_select",
      lookupEntity: "staffs",
      lookupLabelField: "full_name",
    },
    {
      key: "tech_equipment_id",
      label: "Thiết bị",
      type: "entity_select",
      lookupEntity: "tech_equipments",
      lookupLabelField: "name",
    },
  ],
  enum_constants: [{ key: "type", label: "Loại", type: "text" }],
};

/**
 * Columns that show keeper badges (main/vice) in the table and detail panel.
 * key = FK column on the primary entity; value = config to load keepers.
 */
export const KEEPER_COLUMN_CONFIG = {
  // warehouses.keeper_id → show all keepers from staff_warehouses
  keeper_id: {
    junctionEntity: "staff_warehouses",
    junctionFkField: "warehouse_id", // FK on the junction pointing back to this entity
    junctionStaffField: "staff_id", // FK on the junction pointing to staffs
    isMainField: "is_main_keeper",
    staffLabelField: "full_name",
    mainLabel: "Thủ kho chính",
    viceLabel: "Thủ kho phó",
    columnLabel: "Thủ kho",
  },
};

// FK columns to resolve to labels in the data table.
// key = column name in the row; entity/labelField = where to load the label from.
// Note: keeper_id is handled by KEEPER_COLUMN_CONFIG above (renders badges, not plain text).
export const FK_DISPLAY = {
  warehouse_id: {
    entity: "warehouses",
    labelField: "code",
    columnLabel: "Kho",
  },
};

export const ENTITY_LABELS = {
  staffs: "Cán bộ",
  warehouses: "Kho trạm xưởng",
  warehouse_images: "Ảnh kho",
  warehouse_equipments: "Trang bị kho",
  warehouse_inspections: "Kiểm tra kho",
  warehouse_accesses: "Ra vào kho",
  warehouse_handovers: "Giao nhận",
  warehouse_exports: "Xuất kho",
  warehouse_imports: "Nhập kho",
  warehouse_lightnings: "Chống sét",
  weapons: "Vũ khí",
  tech_equipments: "Thiết bị KT",
  vehicles: "Phương tiện",
  materials: "Vật tư",
};

export const ENTITY_ICONS = {
  staffs: "👤",
  warehouses: "🏭",
  warehouse_images: "🖼️",
  warehouse_equipments: "🔧",
  warehouse_inspections: "🔍",
  warehouse_accesses: "🚪",
  warehouse_handovers: "🤝",
  warehouse_exports: "📤",
  warehouse_imports: "📥",
  warehouse_lightnings: "⚡",
  weapons: "⚔️",
  tech_equipments: "💻",
  vehicles: "🚗",
  materials: "📦",
};

/**
 * Many-to-many relationship configs shown inline in the edit panel.
 * Only included for entities that have M2M relationships.
 */
export const M2M_CONFIG = {
  staffs: [
    {
      junctionEntity: "staff_warehouses",
      filterField: "staff_id",
      targetEntity: "warehouses",
      targetIdField: "warehouse_id",
      targetLabelField: "code",
      primaryEntity: "staffs",
      primaryLabelField: "full_name",
      coAssigneeTitle: "Cán bộ khác phụ trách kho này",
      label: "Kho phụ trách",
      isMainField: "is_main_keeper",
      mainLabel: "Thủ kho chính",
      viceLabel: "Thủ kho phó",
    },
    {
      junctionEntity: "staff_weapons",
      filterField: "staff_id",
      targetEntity: "weapons",
      targetIdField: "weapon_id",
      targetLabelField: "name",
      primaryEntity: "staffs",
      primaryLabelField: "full_name",
      coAssigneeTitle: "Cán bộ khác phụ trách vũ khí này",
      label: "Vũ khí phụ trách",
    },
    {
      junctionEntity: "staff_vehicles",
      filterField: "staff_id",
      targetEntity: "vehicles",
      targetIdField: "vehicle_id",
      targetLabelField: "name",
      primaryEntity: "staffs",
      primaryLabelField: "full_name",
      coAssigneeTitle: "Cán bộ khác phụ trách phương tiện này",
      label: "Phương tiện phụ trách",
    },
    {
      junctionEntity: "staff_tech_equipment",
      filterField: "staff_id",
      targetEntity: "tech_equipments",
      targetIdField: "tech_equipment_id",
      targetLabelField: "name",
      primaryEntity: "staffs",
      primaryLabelField: "full_name",
      coAssigneeTitle: "Cán bộ khác phụ trách thiết bị này",
      label: "Thiết bị phụ trách",
    },
  ],

  warehouses: [
    {
      junctionEntity: "staff_warehouses",
      filterField: "warehouse_id",
      targetEntity: "staffs",
      targetIdField: "staff_id",
      targetLabelField: "full_name",
      primaryEntity: "warehouses",
      primaryLabelField: "code",
      coAssigneeTitle: "Kho khác phụ trách bởi cán bộ này",
      label: "Cán bộ phụ trách",
      isMainField: "is_main_keeper",
      mainLabel: "Thủ kho chính",
      viceLabel: "Thủ kho phó",
    },
  ],

  weapons: [
    {
      junctionEntity: "staff_weapons",
      filterField: "weapon_id",
      targetEntity: "staffs",
      targetIdField: "staff_id",
      targetLabelField: "full_name",
      primaryEntity: "weapons",
      primaryLabelField: "name",
      coAssigneeTitle: "Vũ khí khác phụ trách bởi cán bộ này",
      label: "Cán bộ phụ trách",
    },
  ],

  vehicles: [
    {
      junctionEntity: "staff_vehicles",
      filterField: "vehicle_id",
      targetEntity: "staffs",
      targetIdField: "staff_id",
      targetLabelField: "full_name",
      primaryEntity: "vehicles",
      primaryLabelField: "name",
      coAssigneeTitle: "Phương tiện khác phụ trách bởi cán bộ này",
      label: "Cán bộ phụ trách",
    },
  ],

  tech_equipments: [
    {
      junctionEntity: "staff_tech_equipment",
      filterField: "tech_equipment_id",
      targetEntity: "staffs",
      targetIdField: "staff_id",
      targetLabelField: "full_name",
      primaryEntity: "tech_equipments",
      primaryLabelField: "name",
      coAssigneeTitle: "Thiết bị khác phụ trách bởi cán bộ này",
      label: "Cán bộ phụ trách",
    },
  ],
};
