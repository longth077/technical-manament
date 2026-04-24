import { ENTITY_LABELS, ENTITY_ICONS } from '../services/entityConfig';

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
