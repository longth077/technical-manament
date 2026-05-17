import { useState } from 'react';
import AdminUsers from './AdminUsers';
import { Api } from '../services/api';

const ROLE_VI = { admin: 'Quản trị viên', user: 'Người dùng', readonly: 'Chỉ xem' };
const STATUS_VI = { approved: 'Đã duyệt', pending: 'Chờ duyệt' };

export default function AccountPanel({ user, credential, onClose, onSignOut }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');

    if (!currentPassword) {
      setPwError('Vui lòng nhập mật khẩu hiện tại.');
      return;
    }
    if (!newPassword) {
      setPwError('Vui lòng nhập mật khẩu mới.');
      return;
    }
    if (newPassword.length < 8) {
      setPwError('Mật khẩu mới phải có ít nhất 8 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError('Mật khẩu nhập lại không khớp.');
      return;
    }
    if (newPassword === currentPassword) {
      setPwError('Mật khẩu mới không được trùng với mật khẩu hiện tại.');
      return;
    }

    setPwLoading(true);
    try {
      await Api.changePassword({ currentPassword, newPassword, confirmPassword }, credential);
      setPwSuccess('Đổi mật khẩu thành công!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('incorrect') || msg.includes('Current password')) {
        setPwError('Mật khẩu hiện tại không đúng.');
      } else {
        setPwError('Đổi mật khẩu thất bại. Vui lòng thử lại.');
      }
    } finally {
      setPwLoading(false);
    }
  };

  const togglePw = () => {
    setPwOpen((o) => !o);
    setPwError('');
    setPwSuccess('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

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

        {/* Change password — collapsible */}
        <div className="account-change-password">
          <button
            type="button"
            className="account-section-toggle"
            onClick={togglePw}
            aria-expanded={pwOpen}
          >
            <span>🔑 Đổi mật khẩu</span>
            <span className={`toggle-chevron ${pwOpen ? 'open' : ''}`}>▾</span>
          </button>

          {pwOpen && (
            <form onSubmit={handleChangePassword} noValidate className="account-pw-form">
              <div className="form-group">
                <label>Mật khẩu hiện tại</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại"
                  autoComplete="current-password"
                />
              </div>
              <div className="form-group">
                <label>Mật khẩu mới</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Tối thiểu 8 ký tự"
                  autoComplete="new-password"
                />
              </div>
              <div className="form-group">
                <label>Nhập lại mật khẩu mới</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  autoComplete="new-password"
                />
              </div>
              {pwError && <div className="alert alert-error">{pwError}</div>}
              {pwSuccess && <div className="alert alert-success">{pwSuccess}</div>}
              <button type="submit" className="btn btn-primary" disabled={pwLoading}>
                {pwLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
              </button>
            </form>
          )}
        </div>

        {/* Logout */}
        <div className="account-logout-section">
          <button
            type="button"
            className="btn btn-danger btn-full"
            onClick={() => { onClose(); onSignOut(); }}
          >
            🚪 Đăng xuất
          </button>
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
