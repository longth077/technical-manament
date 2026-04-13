// Column definitions for Excel export/import
// Each array item: { key: 'modelField', label: 'Vietnamese Header' }

const staffColumns = [
  { key: 'fullName', label: 'Họ và tên' },
  { key: 'dateOfBirth', label: 'Ngày tháng năm sinh' },
  { key: 'idNumber', label: 'Số CMTQĐ/CCCD' },
  { key: 'rank', label: 'Cấp bậc' },
  { key: 'position', label: 'Chức vụ' },
  { key: 'unitDepartment', label: 'Đơn vị bộ phận' },
  { key: 'education', label: 'Trình độ đào tạo' },
  { key: 'assignedWarehouse', label: 'Kho trạm xưởng đảm nhiệm' },
  { key: 'assignedWeapons', label: 'VKTB đảm nhiệm' },
  { key: 'assignedVehicles', label: 'Phương tiện đảm nhiệm' },
  { key: 'assignedEquipment', label: 'Trang bị vật tư đảm nhiệm' },
];

const weaponColumns = [
  { key: 'name', label: 'Vũ khí trang bị' },
  { key: 'classification', label: 'Phân cấp' },
  { key: 'unitMeasure', label: 'Đơn vị tính' },
  { key: 'quantity', label: 'Số lượng' },
  { key: 'country', label: 'Nước sản xuất' },
  { key: 'year', label: 'Năm sản xuất' },
  { key: 'assignedUnit', label: 'Biên chế đơn vị' },
  { key: 'assignedIndividual', label: 'Biên chế cá nhân' },
];

const techEquipmentColumns = [
  { key: 'name', label: 'Trang thiết bị kỹ thuật' },
  { key: 'classification', label: 'Phân cấp' },
  { key: 'unitMeasure', label: 'Đơn vị tính' },
  { key: 'quantity', label: 'Số lượng' },
  { key: 'country', label: 'Nước sản xuất' },
  { key: 'year', label: 'Năm sản xuất' },
  { key: 'assignedUnit', label: 'Biên chế đơn vị' },
  { key: 'assignedIndividual', label: 'Biên chế cá nhân' },
  { key: 'repair', label: 'Sửa chữa' },
  { key: 'operatingHours', label: 'Số giờ hoạt động' },
];

const vehicleColumns = [
  { key: 'name', label: 'Phương tiện' },
  { key: 'classification', label: 'Phân cấp' },
  { key: 'brand', label: 'Hãng xe' },
  { key: 'vehicleType', label: 'Loại xe' },
  { key: 'country', label: 'Nước sản xuất' },
  { key: 'year', label: 'Năm sản xuất' },
  { key: 'assignedUnit', label: 'Biên chế đơn vị' },
  { key: 'assignedIndividual', label: 'Biên chế cá nhân' },
  { key: 'repair', label: 'Sửa chữa' },
  { key: 'operatingHours', label: 'Số giờ hoạt động' },
  { key: 'km', label: 'Số KM' },
];

const materialColumns = [
  { key: 'name', label: 'Vật tư' },
  { key: 'classification', label: 'Phân cấp' },
  { key: 'unitMeasure', label: 'Đơn vị tính' },
  { key: 'quantity', label: 'Số lượng' },
  { key: 'country', label: 'Nước sản xuất' },
  { key: 'year', label: 'Năm sản xuất' },
  { key: 'assignedUnit', label: 'Biên chế đơn vị' },
  { key: 'assignedIndividual', label: 'Biên chế cá nhân' },
];

const warehouseColumns = [
  { key: 'code', label: 'Kho trạm xưởng' },
  { key: 'functionDesc', label: 'Chức năng' },
  { key: 'keeper', label: 'Thủ kho' },
  { key: 'managingUnit', label: 'Đơn vị phụ trách' },
  { key: 'area', label: 'Diện tích' },
  { key: 'constructionDate', label: 'Tháng năm xây dựng' },
  { key: 'notes', label: 'Ghi chú' },
];

const warehouseEquipmentColumns = [
  { key: 'name', label: 'Tên trang bị, vật tư' },
  { key: 'model', label: 'Kiểu model' },
  { key: 'country', label: 'Nước sản xuất' },
  { key: 'certification', label: 'Kiểm định' },
  { key: 'maintenance', label: 'Sửa chữa, bảo dưỡng' },
  { key: 'importExport', label: 'Xuất nhập' },
];

const warehouseInspectionColumns = [
  { key: 'date', label: 'Ngày tháng năm' },
  { key: 'inspectorName', label: 'Họ tên người kiểm tra' },
  { key: 'inspectorPosition', label: 'Chức vụ' },
  { key: 'content', label: 'Nội dung kiểm tra' },
  { key: 'evaluation', label: 'Nhận xét' },
  { key: 'requirements', label: 'Yêu cầu, chỉ thị' },
  { key: 'serverName', label: 'Người phục vụ' },
];

const warehouseAccessColumns = [
  { key: 'date', label: 'Ngày tháng năm' },
  { key: 'visitorName', label: 'Người ra vào' },
  { key: 'companionCount', label: 'Số người đi cùng' },
  { key: 'unit', label: 'Đơn vị' },
  { key: 'responsiblePerson', label: 'Người phụ trách' },
  { key: 'timeIn', label: 'Thời gian vào' },
  { key: 'timeOut', label: 'Thời gian ra' },
];

const warehouseHandoverColumns = [
  { key: 'equipmentName', label: 'Tên trang bị' },
  { key: 'unit', label: 'ĐVT' },
  { key: 'handoverDate', label: 'Ngày giao' },
  { key: 'qualityLevel', label: 'Cấp chất lượng' },
  { key: 'quantity', label: 'Số lượng' },
  { key: 'giver', label: 'Người giao' },
  { key: 'receiver', label: 'Người nhận' },
  { key: 'returnDate', label: 'Ngày trả' },
  { key: 'returnQuality', label: 'Chất lượng trả' },
  { key: 'returnQuantity', label: 'Số lượng trả' },
  { key: 'returnGiver', label: 'Người trả' },
  { key: 'returnReceiver', label: 'Người nhận trả' },
];

const warehouseExportColumns = [
  { key: 'receiverName', label: 'Người nhận' },
  { key: 'receiverUnit', label: 'Đơn vị' },
  { key: 'reason', label: 'Lý do' },
  { key: 'itemName', label: 'Tên vật tư' },
  { key: 'unitMeasure', label: 'ĐVT' },
  { key: 'requiredQuantity', label: 'Phải xuất' },
  { key: 'actualQuantity', label: 'Thực xuất' },
  { key: 'unitPrice', label: 'Đơn giá' },
  { key: 'totalPrice', label: 'Thành tiền' },
  { key: 'notes', label: 'Ghi chú' },
];

const warehouseImportColumns = [
  { key: 'senderName', label: 'Người giao' },
  { key: 'senderUnit', label: 'Đơn vị' },
  { key: 'reason', label: 'Lý do' },
  { key: 'itemName', label: 'Tên vật tư' },
  { key: 'unitMeasure', label: 'ĐVT' },
  { key: 'requiredQuantity', label: 'Phải nhập' },
  { key: 'actualQuantity', label: 'Thực nhập' },
  { key: 'unitPrice', label: 'Đơn giá' },
  { key: 'totalPrice', label: 'Thành tiền' },
  { key: 'notes', label: 'Ghi chú' },
];

const warehouseLightningColumns = [
  { key: 'date', label: 'Thời gian' },
  { key: 'weather', label: 'Thời tiết' },
  { key: 'directRod1Rdo', label: 'Cột 1 - Rđo' },
  { key: 'directRod1Rxk', label: 'Cột 1 - Rxk' },
  { key: 'directRod1Result', label: 'Cột 1 - Kết luận' },
  { key: 'directRod2Rdo', label: 'Cột 2 - Rđo' },
  { key: 'directRod2Rxk', label: 'Cột 2 - Rxk' },
  { key: 'directRod2Result', label: 'Cột 2 - Kết luận' },
  { key: 'directRod3Rdo', label: 'Cột 3 - Rđo' },
  { key: 'directRod3Rxk', label: 'Cột 3 - Rxk' },
  { key: 'directRod3Result', label: 'Cột 3 - Kết luận' },
  { key: 'inductionRdo', label: 'Cảm ứng - Rđo' },
  { key: 'inductionResult', label: 'Cảm ứng - Kết luận' },
];

const warehouseSubColumns = {
  equipment: warehouseEquipmentColumns,
  inspections: warehouseInspectionColumns,
  access: warehouseAccessColumns,
  handover: warehouseHandoverColumns,
  exports: warehouseExportColumns,
  imports: warehouseImportColumns,
  lightning: warehouseLightningColumns,
};

module.exports = {
  staffColumns,
  weaponColumns,
  techEquipmentColumns,
  vehicleColumns,
  materialColumns,
  warehouseColumns,
  warehouseSubColumns,
};
