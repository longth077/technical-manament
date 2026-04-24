import AdminUsers from './AdminUsers';

const ROLE_VI = { admin: 'Quản trị viên', user: 'Người dùng', readonly: 'Chỉ xem' };
const STATUS_VI = { approved: 'Đã duyệt', pending: 'Chờ duyệt' };

export default function AccountPanel({ user, credential, onClose }) {
  return (
    <div className="account-overlay" onClick={onClose}>
      <div className="account-panel" onClick={(e) => e.stopPropagation()}>
        <div className="account-panel-header">
          <h3>👤 Thông tin tài khoản</h3>
          <button className="btn btn-sm btn-secondary" onClick={onClose}>✕ Đóng</button>
        </div>

        {/* Profile */}
        <div className="account-profile">
          <div className="account-avatar">{user.fullName.charAt(0).toUpperCase()}</div>
          <div className="account-profile-info">
            <div className="account-fullname">{user.fullName}</div>
            <div className="account-meta">
              <span>@{user.username}</span>
              <span>{user.email}</span>
            </div>
            <div className="account-badges">
              <span className={`badge ${user.role === 'admin' ? 'badge-info' : user.role === 'readonly' ? 'badge-warning' : 'badge-success'}`}>
                {ROLE_VI[user.role] || user.role}
              </span>
              <span className={`badge ${user.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>
                {STATUS_VI[user.status] || user.status}
              </span>
            </div>
          </div>
        </div>

        {/* Admin: user management */}
        {user.role === 'admin' && (
          <div className="account-admin-section">
            <div className="account-admin-title">Quản lý tài khoản người dùng</div>
            <AdminUsers credential={credential} />
          </div>
        )}
      </div>
    </div>
  );
}
