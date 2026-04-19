import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

export default function SignUpPage() {
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    if (form.username.length < 3) return 'Tên đăng nhập phải có ít nhất 3 ký tự';
    if (!/^[a-zA-Z0-9_]+$/.test(form.username))
      return 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới';
    if (form.password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
    if (form.password !== form.confirmPassword) return 'Mật khẩu xác nhận không khớp';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    const { error: err } = await signup({
      fullName: form.fullName,
      username: form.username,
      email: form.email,
      password: form.password,
    });
    setLoading(false);

    if (err) {
      setError(err);
    } else {
      setSuccess('Đăng ký thành công! Đang chuyển hướng...');
      setTimeout(() => navigate('/signin'), 1500);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">⚙️</div>
          <h1>QUẢN LÝ KỸ THUẬT</h1>
          <p className="auth-subtitle">Technical Management System</p>
        </div>

        {error && <Alert message={error} type="error" onClose={() => setError('')} />}
        {success && <Alert message={success} type="success" />}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="Nhập họ và tên"
              required
            />
          </div>
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => handleChange('username', e.target.value)}
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Nhập email"
              required
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
              required
            />
          </div>
          <div className="form-group">
            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              placeholder="Nhập lại mật khẩu"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>

        <p className="auth-footer">
          Đã có tài khoản? <Link to="/signin">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
