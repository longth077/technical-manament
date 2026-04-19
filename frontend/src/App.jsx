import { useEffect, useMemo, useState } from 'react';
import EntitySection from './components/EntitySection';
import AdminUsers from './components/AdminUsers';
import AdminDataTransfer from './components/AdminDataTransfer';
import { Api } from './services/api';
import './App.css';

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

const entities = Object.keys(ENTITY_LABELS);

function App() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [credential, setCredential] = useState(localStorage.getItem('credential') || '');
  const [user, setUser] = useState(null);
  const [activeEntity, setActiveEntity] = useState('staff');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('data');

  const canEdit = useMemo(() => user && user.role !== 'readonly', [user]);

  const signIn = async () => {
    if (!usernameOrEmail || !password) {
      setMessage('Username/email and password are required');
      return;
    }
    const encoded = btoa(`${usernameOrEmail}:${password}`);
    try {
      const data = await Api.me(encoded);
      setCredential(encoded);
      localStorage.setItem('credential', encoded);
      setUser(data.user);
      setMessage('');
    } catch (e) {
      setMessage(e.message);
    }
  };

  const signOut = () => {
    localStorage.removeItem('credential');
    setCredential('');
    setUser(null);
    setMessage('');
  };

  const signup = async () => {
    if (!signupUsername || !signupEmail || !signupPassword || !fullName) {
      setMessage('All signup fields are required');
      return;
    }
    if (signupPassword.length < 8) {
      setMessage('Password must be at least 8 characters');
      return;
    }
    try {
      await Api.signup({ username: signupUsername, email: signupEmail, password: signupPassword, fullName });
      setMessage('Signup created, waiting admin approval');
    } catch (e) {
      setMessage(e.message);
    }
  };

  const handleSignInKey = (e) => {
    if (e.key === 'Enter') signIn();
  };

  useEffect(() => {
    if (!credential) return;
    let active = true;
    Api.me(credential)
      .then((data) => {
        if (active) setUser(data.user);
      })
      .catch(() => {
        if (!active) return;
        localStorage.removeItem('credential');
        setCredential('');
        setUser(null);
      });
    return () => {
      active = false;
    };
  }, [credential]);

  /* ---------- Auth Page ---------- */
  if (!user) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-brand">
            <h1>⚙ Quản Lý Kỹ Thuật</h1>
            <p>Technical Management System</p>
          </div>

          <div className="auth-card">
            <h3>Đăng nhập</h3>
            <div className="form-group">
              <input
                className="form-input"
                placeholder="Tên đăng nhập hoặc email"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                onKeyDown={handleSignInKey}
              />
            </div>
            <div className="form-group">
              <input
                className="form-input"
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleSignInKey}
              />
            </div>
            <button className="btn btn-primary btn-full" onClick={signIn}>Đăng nhập</button>
          </div>

          <div className="auth-card">
            <h3>Đăng ký tài khoản</h3>
            <div className="form-group">
              <input className="form-input" placeholder="Họ và tên" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="form-group">
              <input className="form-input" placeholder="Tên đăng nhập" value={signupUsername} onChange={(e) => setSignupUsername(e.target.value)} />
            </div>
            <div className="form-group">
              <input className="form-input" placeholder="Email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <input className="form-input" type="password" placeholder="Mật khẩu (≥ 8 ký tự)" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
            </div>
            <button className="btn btn-outline btn-full" onClick={signup}>Đăng ký</button>
          </div>

          {message && (
            <div className={`auth-message ${message.toLowerCase().includes('waiting') || message.toLowerCase().includes('created') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ---------- Dashboard ---------- */
  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div>
          <h1>⚙ Quản Lý Kỹ Thuật</h1>
          <div className="header-subtitle">Technical Management System</div>
        </div>
        <div className="header-right">
          <span className="user-badge">
            {user.fullName}
            <span className="role-tag">{user.role}</span>
          </span>
          <button className="btn btn-sm btn-signout" onClick={signOut}>Đăng xuất</button>
        </div>
      </header>

      {/* Entity Tabs */}
      <nav className="entity-tabs">
        {entities.map((entity) => (
          <button
            key={entity}
            onClick={() => { setActiveEntity(entity); setActiveTab('data'); }}
            className={`entity-tab ${activeEntity === entity && activeTab === 'data' ? 'active' : ''}`}
          >
            {ENTITY_LABELS[entity]}
          </button>
        ))}
        {user.role === 'admin' && (
          <>
            <button
              className={`entity-tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              👥 Quản lý tài khoản
            </button>
            <button
              className={`entity-tab ${activeTab === 'transfer' ? 'active' : ''}`}
              onClick={() => setActiveTab('transfer')}
            >
              📦 Nhập/Xuất dữ liệu
            </button>
          </>
        )}
      </nav>

      {/* Content */}
      <div className="content-area">
        {message && <div className="status-msg">{message}</div>}

        {activeTab === 'data' && (
          <EntitySection entity={activeEntity} entityLabel={ENTITY_LABELS[activeEntity]} credential={credential} canEdit={canEdit} />
        )}

        {activeTab === 'users' && user.role === 'admin' && (
          <AdminUsers credential={credential} />
        )}

        {activeTab === 'transfer' && user.role === 'admin' && (
          <AdminDataTransfer credential={credential} />
        )}
      </div>
    </div>
  );
}

export default App;
