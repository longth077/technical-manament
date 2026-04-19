/**
 * Column schema for each entity.
 * Each entry is { key, label, type, options?, placeholder? }.
 *   type: 'text' | 'number' | 'date' | 'select' | 'textarea'
 *   options: array of { value, label } for selects
 *
 * Auto-managed columns (id, created_at, updated_at) are excluded.
 */

const RANK_OPTIONS = [
  'Thiếu úy', 'Trung úy', 'Thượng uý', 'Đại úy',
  'Thiếu tá', 'Trung tá', 'Thượng tá', 'Đại tá',
  'Thiếu úy CN', 'Trung úy CN', 'Thượng uý CN',
  'Đại úy CN', 'Thiếu tá CN', 'Trung tá CN',
].map((v) => ({ value: v, label: v }));

const EDUCATION_OPTIONS = [
  { value: '', label: '(Chưa chọn)' },
  { value: 'Sơ cấp', label: 'Sơ cấp' },
  { value: 'Trung cấp', label: 'Trung cấp' },
  { value: 'Cao đẳng', label: 'Cao đẳng' },
  { value: 'Đại học', label: 'Đại học' },
  { value: 'Thạc sĩ', label: 'Thạc sĩ' },
  { value: 'Khác', label: 'Khác' },
];

const REPAIR_OPTIONS = [
  { value: '', label: '(Chưa chọn)' },
  { value: 'Chưa sửa', label: 'Chưa sửa' },
  { value: 'Đang sửa', label: 'Đang sửa' },
  { value: 'Đã sửa', label: 'Đã sửa' },
];

const FILE_TYPE_OPTIONS = [
  { value: 'image/jpeg', label: 'JPEG' },
  { value: 'image/png', label: 'PNG' },
];

export const ENTITY_SCHEMAS = {
  unit_info: [
    { key: 'unit_name', label: 'Tên đơn vị', type: 'text' },
    { key: 'technical_officer', label: 'Trợ lý kỹ thuật', type: 'text' },
    { key: 'statistician', label: 'Nhân viên thống kê', type: 'text' },
  ],

  overview: [
    { key: 'position', label: 'Vị trí', type: 'text' },
    { key: 'area', label: 'Diện tích', type: 'text' },
    { key: 'warehouse_system', label: 'Hệ thống kho', type: 'text' },
    { key: 'fence_system', label: 'Hệ thống hàng rào', type: 'text' },
    { key: 'road_system', label: 'Hệ thống đường', type: 'text' },
    { key: 'fire_system', label: 'Hệ thống PCCC', type: 'text' },
    { key: 'terrain_map', label: 'Bản đồ địa hình', type: 'text' },
    { key: 'land_certificate', label: 'Giấy chứng nhận QSDĐ', type: 'text' },
  ],

  staff: [
    { key: 'full_name', label: 'Họ tên', type: 'text', placeholder: 'Nguyễn Văn A' },
    { key: 'date_of_birth', label: 'Ngày sinh', type: 'date' },
    { key: 'id_number', label: 'Số CMTQĐ/CCCD', type: 'text' },
    { key: 'rank', label: 'Cấp bậc', type: 'select', options: RANK_OPTIONS },
    { key: 'position', label: 'Chức vụ', type: 'text' },
    { key: 'unit_department', label: 'Đơn vị', type: 'text' },
    { key: 'education', label: 'Trình độ', type: 'select', options: EDUCATION_OPTIONS },
    { key: 'assigned_warehouse', label: 'Kho phụ trách', type: 'text' },
    { key: 'assigned_weapons', label: 'Vũ khí phụ trách', type: 'text' },
    { key: 'assigned_vehicles', label: 'Phương tiện phụ trách', type: 'text' },
    { key: 'assigned_equipment', label: 'Thiết bị phụ trách', type: 'text' },
  ],

  warehouses: [
    { key: 'code', label: 'Mã kho', type: 'text' },
    { key: 'function_desc', label: 'Chức năng', type: 'text' },
    { key: 'keeper', label: 'Thủ kho', type: 'text' },
    { key: 'managing_unit', label: 'Đơn vị quản lý', type: 'text' },
    { key: 'area', label: 'Diện tích', type: 'text' },
    { key: 'construction_date', label: 'Ngày xây dựng', type: 'text' },
    { key: 'notes', label: 'Ghi chú', type: 'text' },
  ],

  warehouse_images: [
    { key: 'warehouse_id', label: 'ID Kho', type: 'number' },
    { key: 'file_path', label: 'Đường dẫn file', type: 'text' },
    { key: 'file_type', label: 'Loại file', type: 'select', options: FILE_TYPE_OPTIONS },
    { key: 'description', label: 'Mô tả', type: 'text' },
  ],

  warehouse_equipment: [
    { key: 'warehouse_id', label: 'ID Kho', type: 'number' },
    { key: 'name', label: 'Tên', type: 'text' },
    { key: 'model', label: 'Mẫu', type: 'text' },
    { key: 'country', label: 'Nước SX', type: 'text' },
    { key: 'certification', label: 'Chứng nhận', type: 'text' },
    { key: 'maintenance', label: 'Bảo dưỡng', type: 'text' },
    { key: 'import_export', label: 'Nhập/Xuất', type: 'text' },
  ],

  warehouse_inspections: [
    { key: 'warehouse_id', label: 'ID Kho', type: 'number' },
    { key: 'date', label: 'Ngày', type: 'text' },
    { key: 'inspector_name', label: 'Người kiểm tra', type: 'text' },
    { key: 'inspector_position', label: 'Chức vụ', type: 'text' },
    { key: 'content', label: 'Nội dung', type: 'text' },
    { key: 'evaluation', label: 'Đánh giá', type: 'text' },
    { key: 'requirements', label: 'Yêu cầu', type: 'text' },
    { key: 'server_name', label: 'Phục vụ', type: 'text' },
  ],

  warehouse_access: [
    { key: 'warehouse_id', label: 'ID Kho', type: 'number' },
    { key: 'date', label: 'Ngày', type: 'text' },
    { key: 'visitor_name', label: 'Tên khách', type: 'text' },
    { key: 'companion_count', label: 'Số người đi cùng', type: 'number' },
    { key: 'unit', label: 'Đơn vị', type: 'text' },
    { key: 'responsible_person', label: 'Người chịu trách nhiệm', type: 'text' },
    { key: 'time_in', label: 'Giờ vào', type: 'text' },
    { key: 'time_out', label: 'Giờ ra', type: 'text' },
  ],

  warehouse_handover: [
    { key: 'warehouse_id', label: 'ID Kho', type: 'number' },
    { key: 'equipment_name', label: 'Tên trang bị', type: 'text' },
    { key: 'unit', label: 'Đơn vị', type: 'text' },
    { key: 'handover_date', label: 'Ngày giao', type: 'text' },
    { key: 'quality_level', label: 'Chất lượng', type: 'text' },
    { key: 'quantity', label: 'Số lượng', type: 'number' },
    { key: 'giver', label: 'Người giao', type: 'text' },
    { key: 'receiver', label: 'Người nhận', type: 'text' },
    { key: 'return_date', label: 'Ngày trả', type: 'text' },
    { key: 'return_quality', label: 'CL khi trả', type: 'text' },
    { key: 'return_quantity', label: 'SL khi trả', type: 'number' },
    { key: 'return_giver', label: 'Người trả', type: 'text' },
    { key: 'return_receiver', label: 'Người nhận trả', type: 'text' },
  ],

  warehouse_exports: [
    { key: 'warehouse_id', label: 'ID Kho', type: 'number' },
    { key: 'receiver_name', label: 'Người nhận', type: 'text' },
    { key: 'receiver_unit', label: 'Đơn vị nhận', type: 'text' },
    { key: 'reason', label: 'Lý do', type: 'text' },
    { key: 'item_name', label: 'Tên hàng', type: 'text' },
    { key: 'unit_measure', label: 'Đơn vị tính', type: 'text' },
    { key: 'required_quantity', label: 'SL yêu cầu', type: 'number' },
    { key: 'actual_quantity', label: 'SL thực xuất', type: 'number' },
    { key: 'unit_price', label: 'Đơn giá', type: 'number' },
    { key: 'total_price', label: 'Thành tiền', type: 'number' },
    { key: 'notes', label: 'Ghi chú', type: 'text' },
  ],

  warehouse_imports: [
    { key: 'warehouse_id', label: 'ID Kho', type: 'number' },
    { key: 'sender_name', label: 'Người giao', type: 'text' },
    { key: 'sender_unit', label: 'Đơn vị giao', type: 'text' },
    { key: 'reason', label: 'Lý do', type: 'text' },
    { key: 'item_name', label: 'Tên hàng', type: 'text' },
    { key: 'unit_measure', label: 'Đơn vị tính', type: 'text' },
    { key: 'required_quantity', label: 'SL yêu cầu', type: 'number' },
    { key: 'actual_quantity', label: 'SL thực nhập', type: 'number' },
    { key: 'unit_price', label: 'Đơn giá', type: 'number' },
    { key: 'total_price', label: 'Thành tiền', type: 'number' },
    { key: 'notes', label: 'Ghi chú', type: 'text' },
  ],

  warehouse_lightning: [
    { key: 'warehouse_id', label: 'ID Kho', type: 'number' },
    { key: 'date', label: 'Ngày', type: 'text' },
    { key: 'weather', label: 'Thời tiết', type: 'text' },
    { key: 'direct_rod1_rdo', label: 'Cọc 1 - Rdo', type: 'text' },
    { key: 'direct_rod1_rxk', label: 'Cọc 1 - Rxk', type: 'text' },
    { key: 'direct_rod1_result', label: 'Cọc 1 - KQ', type: 'text' },
    { key: 'direct_rod2_rdo', label: 'Cọc 2 - Rdo', type: 'text' },
    { key: 'direct_rod2_rxk', label: 'Cọc 2 - Rxk', type: 'text' },
    { key: 'direct_rod2_result', label: 'Cọc 2 - KQ', type: 'text' },
    { key: 'direct_rod3_rdo', label: 'Cọc 3 - Rdo', type: 'text' },
    { key: 'direct_rod3_rxk', label: 'Cọc 3 - Rxk', type: 'text' },
    { key: 'direct_rod3_result', label: 'Cọc 3 - KQ', type: 'text' },
    { key: 'induction_rdo', label: 'Cảm ứng - Rdo', type: 'text' },
    { key: 'induction_result', label: 'Cảm ứng - KQ', type: 'text' },
  ],

  weapons: [
    { key: 'name', label: 'Tên vũ khí', type: 'text' },
    { key: 'classification', label: 'Phân loại', type: 'text' },
    { key: 'unit_measure', label: 'Đơn vị tính', type: 'text' },
    { key: 'quantity', label: 'Số lượng', type: 'number' },
    { key: 'country', label: 'Nước SX', type: 'text' },
    { key: 'year', label: 'Năm SX', type: 'number', placeholder: '2024' },
    { key: 'assigned_unit', label: 'Biên chế (đơn vị)', type: 'number' },
    { key: 'assigned_individual', label: 'Biên chế (cá nhân)', type: 'number' },
  ],

  tech_equipment: [
    { key: 'name', label: 'Tên thiết bị', type: 'text' },
    { key: 'classification', label: 'Phân loại', type: 'text' },
    { key: 'unit_measure', label: 'Đơn vị tính', type: 'text' },
    { key: 'quantity', label: 'Số lượng', type: 'number' },
    { key: 'country', label: 'Nước SX', type: 'text' },
    { key: 'year', label: 'Năm SX', type: 'number', placeholder: '2024' },
    { key: 'allocation', label: 'Biên chế', type: 'number' },
    { key: 'repair', label: 'Tình trạng sửa chữa', type: 'select', options: REPAIR_OPTIONS },
    { key: 'operating_hours', label: 'Giờ hoạt động', type: 'number' },
  ],

  vehicles: [
    { key: 'name', label: 'Tên phương tiện', type: 'text' },
    { key: 'classification', label: 'Phân loại', type: 'text' },
    { key: 'brand', label: 'Nhãn hiệu', type: 'text' },
    { key: 'vehicle_type', label: 'Loại xe', type: 'text' },
    { key: 'country', label: 'Nước SX', type: 'text' },
    { key: 'year', label: 'Năm SX', type: 'number', placeholder: '2024' },
    { key: 'allocation', label: 'Biên chế', type: 'number' },
    { key: 'repair', label: 'Tình trạng sửa chữa', type: 'select', options: REPAIR_OPTIONS },
    { key: 'operating_hours', label: 'Giờ hoạt động', type: 'number' },
    { key: 'km', label: 'Số km', type: 'number' },
  ],

  materials: [
    { key: 'name', label: 'Tên vật tư', type: 'text' },
    { key: 'classification', label: 'Phân loại', type: 'text' },
    { key: 'unit_measure', label: 'Đơn vị tính', type: 'text' },
    { key: 'quantity', label: 'Số lượng', type: 'number' },
    { key: 'country', label: 'Nước SX', type: 'text' },
    { key: 'year', label: 'Năm SX', type: 'number', placeholder: '2024' },
    { key: 'assigned_unit', label: 'Biên chế (đơn vị)', type: 'number' },
    { key: 'assigned_individual', label: 'Biên chế (cá nhân)', type: 'number' },
  ],
};

/**
 * Build a default (empty) object for a given entity from its schema.
 */
export function buildDefaultRow(entity) {
  const schema = ENTITY_SCHEMAS[entity];
  if (!schema) return {};
  const row = {};
  for (const col of schema) {
    if (col.type === 'number') row[col.key] = '';
    else if (col.type === 'select') row[col.key] = col.options?.[0]?.value ?? '';
    else row[col.key] = '';
  }
  return row;
}
