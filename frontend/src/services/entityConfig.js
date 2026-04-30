export const ENTITY_LABELS = {
  unit_infos: "Đơn vị",
  overviews: "Tổng quan",
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
  unit_infos: "🏢",
  overviews: "📊",
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
