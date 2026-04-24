const ENTITY_LABELS = {
  unit_info: 'Đơn vị',
  overview: 'Tổng quan',
  staff: 'Cán bộ',
  warehouses: 'Kho trạm xưởng',
  warehouse_images: 'Ảnh kho',
  warehouse_equipment: 'Trang bị kho',
  warehouse_inspections: 'Kiểm tra kho',
  warehouse_access: 'Ra vào kho',
  warehouse_handover: 'Giao nhận',
  warehouse_exports: 'Xuất kho',
  warehouse_imports: 'Nhập kho',
  warehouse_lightning: 'Chống sét',
  weapons: 'Vũ khí',
  tech_equipment: 'Thiết bị KT',
  vehicles: 'Phương tiện',
  materials: 'Vật tư',
};

const ENTITY_ICONS = {
  unit_info: '🏢',
  overview: '📊',
  staff: '👤',
  warehouses: '🏭',
  warehouse_images: '🖼️',
  warehouse_equipment: '🔧',
  warehouse_inspections: '🔍',
  warehouse_access: '🚪',
  warehouse_handover: '🤝',
  warehouse_exports: '📤',
  warehouse_imports: '📥',
  warehouse_lightning: '⚡',
  weapons: '⚔️',
  tech_equipment: '💻',
  vehicles: '🚗',
  materials: '📦',
};

const ROLE_VI = { admin: 'Quản trị viên', user: 'Người dùng', readonly: 'Chỉ xem' };

export default function HomePage({ user, onNavigate }) {
  const entities = Object.keys(ENTITY_LABELS);

  return (
    <div className="home-page">
      {/* Welcome banner */}
      <div className="home-welcome">
        <div className="home-welcome-icon">⚙</div>
        <div className="home-welcome-text">
          <h2>Chào mừng, {user.fullName}!</h2>
          <p>Hệ thống Quản lý Kỹ thuật &mdash; Technical Management System</p>
        </div>
        <span className={`badge ${user.role === 'admin' ? 'badge-info' : user.role === 'readonly' ? 'badge-warning' : 'badge-success'}`}>
          {ROLE_VI[user.role] || user.role}
        </span>
      </div>

      {/* Quick navigation */}
      <div className="home-section-title">Truy cập nhanh</div>
      <div className="home-grid">
        {entities.map((entity) => (
          <button
            key={entity}
            className="home-card"
            onClick={() => onNavigate(entity)}
          >
            <span className="home-card-icon">{ENTITY_ICONS[entity] || '📋'}</span>
            <span className="home-card-label">{ENTITY_LABELS[entity]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
