/**
 * Vietnamese column labels and entity metadata for Excel reports.
 * Mirrors the frontend entitySchema.js & entityConfig.js definitions.
 */

const ENTITY_LABELS = {
  unit_infos: "Thông tin đơn vị",
  overviews: "Tổng quan khu kỹ thuật",
  staffs: "Danh sách cán bộ",
  warehouses: "Kho trạm xưởng",
  warehouse_images: "Ảnh kho",
  warehouse_equipments: "Trang bị vật tư kho",
  warehouse_inspections: "Kiểm tra kho",
  warehouse_accesses: "Đăng ký ra vào kho",
  warehouse_handovers: "Giao nhận tạm thời",
  warehouse_exports: "Xuất kho",
  warehouse_imports: "Nhập kho",
  warehouse_lightnings: "Kiểm tra chống sét",
  weapons: "Vũ khí trang bị",
  tech_equipments: "Trang thiết bị kỹ thuật",
  vehicles: "Phương tiện",
  materials: "Vật tư",
  staff_warehouses: "Phân công thủ kho",
  staff_weapons: "Phân công vũ khí",
  staff_vehicles: "Phân công phương tiện",
  staff_tech_equipment: "Phân công thiết bị kỹ thuật",
};

/**
 * Column definitions per entity: { key, label, width, type }
 * type: 'text' | 'number' | 'date' | 'currency'
 */
const ENTITY_COLUMNS = {
  unit_infos: [
    { key: "id", label: "Mã", width: 6, type: "number" },
    { key: "unit_name", label: "Tên đơn vị", width: 35, type: "text" },
    {
      key: "technical_officer",
      label: "Trợ lý kỹ thuật",
      width: 25,
      type: "text",
    },
    {
      key: "statistician",
      label: "Nhân viên thống kê",
      width: 25,
      type: "text",
    },
  ],

  overviews: [
    { key: "id", label: "Mã", width: 6, type: "number" },
    { key: "position", label: "Vị trí", width: 30, type: "text" },
    { key: "area", label: "Diện tích", width: 18, type: "text" },
    { key: "warehouse_system", label: "Hệ thống kho", width: 25, type: "text" },
    {
      key: "fence_system",
      label: "Hệ thống hàng rào",
      width: 25,
      type: "text",
    },
    { key: "road_system", label: "Hệ thống đường", width: 25, type: "text" },
    { key: "fire_system", label: "Hệ thống PCCC", width: 22, type: "text" },
    { key: "terrain_map", label: "Bản đồ địa hình", width: 22, type: "text" },
    { key: "land_certificate", label: "Giấy CN QSDĐ", width: 25, type: "text" },
  ],

  staffs: [
    { key: "id", label: "STT", width: 6, type: "number" },
    { key: "full_name", label: "Họ và tên", width: 28, type: "text" },
    { key: "date_of_birth", label: "Ngày sinh", width: 14, type: "date" },
    { key: "id_number", label: "Số CMTQĐ/CCCD", width: 20, type: "text" },
    { key: "rank_id", label: "Cấp bậc", width: 16, type: "enum:staff_rank" },
    { key: "position", label: "Chức vụ", width: 22, type: "text" },
    { key: "unit_department", label: "Đơn vị", width: 22, type: "text" },
    {
      key: "education_id",
      label: "Trình độ",
      width: 20,
      type: "enum:staff_education",
    },
    { key: "created_at", label: "Ngày tạo", width: 18, type: "date" },
  ],

  warehouses: [
    { key: "id", label: "STT", width: 6, type: "number" },
    { key: "code", label: "Mã kho", width: 18, type: "text" },
    { key: "function_desc", label: "Chức năng", width: 30, type: "text" },
    {
      key: "keeper_id",
      label: "Thủ kho",
      width: 28,
      type: "fk:staffs:full_name",
    },
    { key: "managing_unit", label: "Đơn vị quản lý", width: 25, type: "text" },
    { key: "area", label: "Diện tích", width: 16, type: "text" },
    {
      key: "construction_date",
      label: "Ngày xây dựng",
      width: 16,
      type: "date",
    },
    { key: "notes", label: "Ghi chú", width: 30, type: "text" },
    { key: "created_at", label: "Ngày tạo", width: 18, type: "date" },
  ],

  warehouse_images: [
    { key: "id", label: "STT", width: 6, type: "number" },
    {
      key: "warehouse_id",
      label: "Mã kho",
      width: 20,
      type: "fk:warehouses:code",
    },
    { key: "file_path", label: "Đường dẫn", width: 40, type: "text" },
    {
      key: "file_type_id",
      label: "Loại file",
      width: 16,
      type: "enum:warehouse_image_file_type",
    },
    { key: "description", label: "Mô tả", width: 30, type: "text" },
    { key: "uploaded_at", label: "Ngày tải lên", width: 18, type: "date" },
  ],

  warehouse_equipments: [
    { key: "id", label: "STT", width: 6, type: "number" },
    {
      key: "warehouse_id",
      label: "Kho",
      width: 20,
      type: "fk:warehouses:code",
    },
    { key: "name", label: "Tên", width: 28, type: "text" },
    { key: "model", label: "Mẫu", width: 18, type: "text" },
    { key: "country", label: "Nước SX", width: 14, type: "text" },
    { key: "certification", label: "Chứng nhận", width: 22, type: "text" },
    { key: "maintenance", label: "Bảo dưỡng", width: 20, type: "text" },
    { key: "import_export", label: "Nhập/Xuất", width: 16, type: "text" },
    { key: "created_at", label: "Ngày tạo", width: 18, type: "date" },
  ],

  warehouse_inspections: [
    { key: "id", label: "STT", width: 6, type: "number" },
    {
      key: "warehouse_id",
      label: "Kho",
      width: 20,
      type: "fk:warehouses:code",
    },
    { key: "date", label: "Ngày kiểm tra", width: 14, type: "date" },
    { key: "inspector_name", label: "Người kiểm tra", width: 25, type: "text" },
    { key: "inspector_position", label: "Chức vụ", width: 20, type: "text" },
    { key: "content", label: "Nội dung", width: 35, type: "text" },
    { key: "evaluation", label: "Đánh giá", width: 20, type: "text" },
    { key: "requirements", label: "Yêu cầu", width: 30, type: "text" },
    { key: "server_name", label: "Phục vụ", width: 20, type: "text" },
    { key: "created_at", label: "Ngày tạo", width: 18, type: "date" },
  ],

  warehouse_accesses: [
    { key: "id", label: "STT", width: 6, type: "number" },
    {
      key: "warehouse_id",
      label: "Kho",
      width: 20,
      type: "fk:warehouses:code",
    },
    { key: "date", label: "Ngày", width: 14, type: "date" },
    { key: "visitor_name", label: "Tên khách", width: 25, type: "text" },
    {
      key: "companion_count",
      label: "Số người đi cùng",
      width: 18,
      type: "number",
    },
    { key: "unit", label: "Đơn vị", width: 22, type: "text" },
    {
      key: "responsible_person",
      label: "Người chịu trách nhiệm",
      width: 28,
      type: "text",
    },
    { key: "time_in", label: "Giờ vào", width: 12, type: "text" },
    { key: "time_out", label: "Giờ ra", width: 12, type: "text" },
    { key: "created_at", label: "Ngày tạo", width: 18, type: "date" },
  ],

  warehouse_handovers: [
    { key: "id", label: "STT", width: 6, type: "number" },
    {
      key: "warehouse_id",
      label: "Kho",
      width: 20,
      type: "fk:warehouses:code",
    },
    { key: "equipment_name", label: "Tên trang bị", width: 30, type: "text" },
    { key: "unit", label: "Đơn vị", width: 22, type: "text" },
    { key: "handover_date", label: "Ngày giao", width: 14, type: "date" },
    { key: "quality_level", label: "Chất lượng", width: 16, type: "text" },
    { key: "quantity", label: "Số lượng", width: 12, type: "number" },
    { key: "giver", label: "Người giao", width: 22, type: "text" },
    { key: "receiver", label: "Người nhận", width: 22, type: "text" },
    { key: "return_date", label: "Ngày trả", width: 14, type: "date" },
    { key: "return_quality", label: "Chất lượng trả", width: 16, type: "text" },
    { key: "return_quantity", label: "SL khi trả", width: 12, type: "number" },
    { key: "return_giver", label: "Người trả", width: 22, type: "text" },
    {
      key: "return_receiver",
      label: "Người nhận trả",
      width: 22,
      type: "text",
    },
    { key: "created_at", label: "Ngày tạo", width: 18, type: "date" },
  ],

  warehouse_exports: [
    { key: "id", label: "STT", width: 6, type: "number" },
    {
      key: "warehouse_id",
      label: "Kho",
      width: 20,
      type: "fk:warehouses:code",
    },
    { key: "receiver_name", label: "Người nhận", width: 25, type: "text" },
    { key: "receiver_unit", label: "Đơn vị nhận", width: 22, type: "text" },
    { key: "reason", label: "Lý do", width: 30, type: "text" },
    { key: "item_name", label: "Tên hàng", width: 30, type: "text" },
    { key: "unit_measure", label: "Đơn vị tính", width: 14, type: "text" },
    {
      key: "required_quantity",
      label: "SL yêu cầu",
      width: 14,
      type: "number",
    },
    {
      key: "actual_quantity",
      label: "SL thực xuất",
      width: 14,
      type: "number",
    },
    { key: "unit_price", label: "Đơn giá (đ)", width: 16, type: "currency" },
    {
      key: "total_price",
      label: "Thành tiền (đ)",
      width: 18,
      type: "currency",
    },
    { key: "notes", label: "Ghi chú", width: 28, type: "text" },
    { key: "created_at", label: "Ngày tạo", width: 18, type: "date" },
  ],

  warehouse_imports: [
    { key: "id", label: "STT", width: 6, type: "number" },
    {
      key: "warehouse_id",
      label: "Kho",
      width: 20,
      type: "fk:warehouses:code",
    },
    { key: "sender_name", label: "Người giao", width: 25, type: "text" },
    { key: "sender_unit", label: "Đơn vị giao", width: 22, type: "text" },
    { key: "reason", label: "Lý do", width: 30, type: "text" },
    { key: "item_name", label: "Tên hàng", width: 30, type: "text" },
    { key: "unit_measure", label: "Đơn vị tính", width: 14, type: "text" },
    {
      key: "required_quantity",
      label: "SL yêu cầu",
      width: 14,
      type: "number",
    },
    {
      key: "actual_quantity",
      label: "SL thực nhập",
      width: 14,
      type: "number",
    },
    { key: "unit_price", label: "Đơn giá (đ)", width: 16, type: "currency" },
    {
      key: "total_price",
      label: "Thành tiền (đ)",
      width: 18,
      type: "currency",
    },
    { key: "notes", label: "Ghi chú", width: 28, type: "text" },
    { key: "created_at", label: "Ngày tạo", width: 18, type: "date" },
  ],

  warehouse_lightnings: [
    { key: "id", label: "STT", width: 6, type: "number" },
    {
      key: "warehouse_id",
      label: "Kho",
      width: 20,
      type: "fk:warehouses:code",
    },
    { key: "date", label: "Ngày kiểm tra", width: 14, type: "date" },
    { key: "weather", label: "Thời tiết", width: 14, type: "text" },
    {
      key: "direct_rod1_rdo",
      label: "Cọc 1 - Rdo (Ω)",
      width: 16,
      type: "text",
    },
    {
      key: "direct_rod1_rxk",
      label: "Cọc 1 - Rxk (Ω)",
      width: 16,
      type: "text",
    },
    {
      key: "direct_rod1_result",
      label: "Cọc 1 - Kết quả",
      width: 16,
      type: "text",
    },
    {
      key: "direct_rod2_rdo",
      label: "Cọc 2 - Rdo (Ω)",
      width: 16,
      type: "text",
    },
    {
      key: "direct_rod2_rxk",
      label: "Cọc 2 - Rxk (Ω)",
      width: 16,
      type: "text",
    },
    {
      key: "direct_rod2_result",
      label: "Cọc 2 - Kết quả",
      width: 16,
      type: "text",
    },
    {
      key: "direct_rod3_rdo",
      label: "Cọc 3 - Rdo (Ω)",
      width: 16,
      type: "text",
    },
    {
      key: "direct_rod3_rxk",
      label: "Cọc 3 - Rxk (Ω)",
      width: 16,
      type: "text",
    },
    {
      key: "direct_rod3_result",
      label: "Cọc 3 - Kết quả",
      width: 16,
      type: "text",
    },
    {
      key: "induction_rdo",
      label: "Cảm ứng - Rdo (Ω)",
      width: 18,
      type: "text",
    },
    {
      key: "induction_result",
      label: "Cảm ứng - Kết quả",
      width: 18,
      type: "text",
    },
    { key: "created_at", label: "Ngày tạo", width: 18, type: "date" },
  ],

  weapons: [
    { key: "id", label: "STT", width: 6, type: "number" },
    { key: "name", label: "Tên vũ khí", width: 30, type: "text" },
    { key: "classification", label: "Phân loại", width: 20, type: "text" },
    { key: "unit_measure", label: "Đơn vị tính", width: 14, type: "text" },
    { key: "quantity", label: "Số lượng", width: 12, type: "number" },
    { key: "country", label: "Nước sản xuất", width: 18, type: "text" },
    { key: "year", label: "Năm sản xuất", width: 14, type: "number" },
    {
      key: "assigned_unit",
      label: "Biên chế (đơn vị)",
      width: 18,
      type: "number",
    },
    {
      key: "assigned_individual",
      label: "Biên chế (cá nhân)",
      width: 18,
      type: "number",
    },
    { key: "created_at", label: "Ngày tạo", width: 18, type: "date" },
  ],

  tech_equipments: [
    { key: "id", label: "STT", width: 6, type: "number" },
    { key: "name", label: "Tên thiết bị", width: 30, type: "text" },
    { key: "classification", label: "Phân loại", width: 20, type: "text" },
    { key: "unit_measure", label: "Đơn vị tính", width: 14, type: "text" },
    { key: "quantity", label: "Số lượng", width: 12, type: "number" },
    { key: "country", label: "Nước sản xuất", width: 18, type: "text" },
    { key: "year", label: "Năm sản xuất", width: 14, type: "number" },
    { key: "allocation", label: "Biên chế", width: 14, type: "number" },
    {
      key: "repair_id",
      label: "Tình trạng sửa chữa",
      width: 24,
      type: "enum:repair_status",
    },
    {
      key: "operating_hours",
      label: "Giờ hoạt động",
      width: 16,
      type: "number",
    },
    { key: "created_at", label: "Ngày tạo", width: 18, type: "date" },
  ],

  vehicles: [
    { key: "id", label: "STT", width: 6, type: "number" },
    { key: "name", label: "Tên phương tiện", width: 30, type: "text" },
    { key: "classification", label: "Phân loại", width: 20, type: "text" },
    { key: "brand", label: "Nhãn hiệu", width: 18, type: "text" },
    { key: "vehicle_type", label: "Loại xe", width: 16, type: "text" },
    { key: "country", label: "Nước sản xuất", width: 18, type: "text" },
    { key: "year", label: "Năm sản xuất", width: 14, type: "number" },
    { key: "allocation", label: "Biên chế", width: 14, type: "number" },
    {
      key: "repair_id",
      label: "Tình trạng sửa chữa",
      width: 24,
      type: "enum:repair_status",
    },
    {
      key: "operating_hours",
      label: "Giờ hoạt động",
      width: 16,
      type: "number",
    },
    { key: "km", label: "Số km", width: 12, type: "number" },
    { key: "created_at", label: "Ngày tạo", width: 18, type: "date" },
  ],

  materials: [
    { key: "id", label: "STT", width: 6, type: "number" },
    { key: "name", label: "Tên vật tư", width: 30, type: "text" },
    { key: "classification", label: "Phân loại", width: 20, type: "text" },
    { key: "unit_measure", label: "Đơn vị tính", width: 14, type: "text" },
    { key: "quantity", label: "Số lượng", width: 12, type: "number" },
    { key: "country", label: "Nước sản xuất", width: 18, type: "text" },
    { key: "year", label: "Năm sản xuất", width: 14, type: "number" },
    {
      key: "assigned_unit",
      label: "Biên chế (đơn vị)",
      width: 18,
      type: "number",
    },
    {
      key: "assigned_individual",
      label: "Biên chế (cá nhân)",
      width: 18,
      type: "number",
    },
    { key: "created_at", label: "Ngày tạo", width: 18, type: "date" },
  ],

  staff_warehouses: [
    { key: "id", label: "STT", width: 6, type: "number" },
    {
      key: "staff_id",
      label: "Cán bộ",
      width: 30,
      type: "fk:staffs:full_name",
    },
    {
      key: "warehouse_id",
      label: "Kho",
      width: 22,
      type: "fk:warehouses:code",
    },
    {
      key: "is_main_keeper",
      label: "Thủ kho chính",
      width: 16,
      type: "boolean",
    },
    { key: "assigned_at", label: "Ngày phân công", width: 18, type: "date" },
  ],

  staff_weapons: [
    { key: "id", label: "STT", width: 6, type: "number" },
    {
      key: "staff_id",
      label: "Cán bộ",
      width: 30,
      type: "fk:staffs:full_name",
    },
    { key: "weapon_id", label: "Vũ khí", width: 28, type: "fk:weapons:name" },
    { key: "assigned_at", label: "Ngày phân công", width: 18, type: "date" },
  ],

  staff_vehicles: [
    { key: "id", label: "STT", width: 6, type: "number" },
    {
      key: "staff_id",
      label: "Cán bộ",
      width: 30,
      type: "fk:staffs:full_name",
    },
    {
      key: "vehicle_id",
      label: "Phương tiện",
      width: 28,
      type: "fk:vehicles:name",
    },
    { key: "assigned_at", label: "Ngày phân công", width: 18, type: "date" },
  ],

  staff_tech_equipment: [
    { key: "id", label: "STT", width: 6, type: "number" },
    {
      key: "staff_id",
      label: "Cán bộ",
      width: 30,
      type: "fk:staffs:full_name",
    },
    {
      key: "tech_equipment_id",
      label: "Thiết bị",
      width: 28,
      type: "fk:tech_equipments:name",
    },
    { key: "assigned_at", label: "Ngày phân công", width: 18, type: "date" },
  ],
};

module.exports = { ENTITY_LABELS, ENTITY_COLUMNS };
