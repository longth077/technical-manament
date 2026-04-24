import { useEffect, useMemo, useState } from 'react';
import EntitySection from './components/EntitySection';
import AdminDataTransfer from './components/AdminDataTransfer';
import HomePage from './components/HomePage';
import AccountPanel from './components/AccountPanel';
import { Api } from './services/api';
import { ENTITY_LABELS, ENTITY_ICONS } from './services/entityConfig';
import './App.css';

const entities = Object.keys(ENTITY_LABELS);

/* Session duration: 8 hours */
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

function App() {
  /* ── Auth state ── */
  const [authView, setAuthView] = useState('login'); // 'login' | 'signup'
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [signupFullName, setSignupFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [authMessage, setAuthMessage] = useState({ text: '', success: false });

  /* ── App state ── */
  const [credential, setCredential] = useState(localStorage.getItem('credential') || '');
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('home'); // 'home' | entity key | 'transfer'
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [accountPanelOpen, setAccountPanelOpen] = useState(false);
  const [sessionMsg, setSessionMsg] = useState('');

  const canEdit = useMemo(() => user && user.role !== 'readonly', [user]);

  /* ── Sign in ── */
  const signIn = async () => {
    if (!loginId || !loginPw) {
      setAuthMessage({ text: 'Vui lòng nhập tên đăng nhập/email và mật khẩu', success: false });
      return;
    }
    const encoded = btoa(`${loginId}:${loginPw}`);
    try {
      const data = await Api.me(encoded);
      setCredential(encoded);
      localStorage.setItem('credential', encoded);
      localStorage.setItem('loginTime', Date.now().toString());
      setUser(data.user);
      setAuthMessage({ text: '', success: false });
      setSessionMsg('');
    } catch (e) {
      setAuthMessage({ text: e.message, success: false });
    }
  };

  /* ── Sign out ── */
  const signOut = (msg = '') => {
    localStorage.removeItem('credential');
    localStorage.removeItem('loginTime');
    setCredential('');
    setUser(null);
    setActiveView('home');
    setAccountPanelOpen(false);
    setSessionMsg(msg);
  };

  /* ── Sign up ── */
  const signup = async () => {
    if (!signupUsername || !signupEmail || !signupPassword || !signupFullName) {
      setAuthMessage({ text: 'Vui lòng điền đầy đủ tất cả các trường', success: false });
      return;
    }
    if (signupPassword.length < 8) {
      setAuthMessage({ text: 'Mật khẩu phải có ít nhất 8 ký tự', success: false });
      return;
    }
    try {
      await Api.signup({ username: signupUsername, email: signupEmail, password: signupPassword, fullName: signupFullName });
      setAuthMessage({ text: 'Đăng ký thành công! Vui lòng chờ quản trị viên duyệt tài khoản.', success: true });
      setSignupFullName(''); setSignupEmail(''); setSignupUsername(''); setSignupPassword('');
    } catch (e) {
      setAuthMessage({ text: e.message, success: false });
    }
  };

  /* ── Session restore on mount ── */
  useEffect(() => {
    if (!credential) return;
    let active = true;
    Api.me(credential)
      .then((data) => {
        if (active) setUser(data.user);
      })
      .catch(() => {
        if (!active) return;
        signOut();
      });
    return () => { active = false; };
  }, [credential]);

  /* ── Session timeout: check every minute ── */
  useEffect(() => {
    if (!credential) return;
    const check = () => {
      const loginTime = localStorage.getItem('loginTime');
      if (loginTime && Date.now() - parseInt(loginTime, 10) > SESSION_DURATION_MS) {
        signOut('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
      }
    };
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, [credential]);

  /* ── Auth pages ── */
  if (!user) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-brand">
            <div className="auth-brand-icon">⚙</div>
            <h1>Quản Lý Kỹ Thuật</h1>
            <p>Hệ thống Quản lý Kỹ thuật</p>
          </div>

          {sessionMsg && (
            <div className="auth-message error">{sessionMsg}</div>
          )}

          {authView === 'login' ? (
            /* ── Login form ── */
            <div className="auth-card">
              <h3>Đăng nhập</h3>
              <div className="form-group">
                <label className="form-label">Tên đăng nhập hoặc Email</label>
                <input
                  className="form-input"
                  placeholder="Nhập tên đăng nhập hoặc email"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && signIn()}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mật khẩu</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={loginPw}
                  onChange={(e) => setLoginPw(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && signIn()}
                />
              </div>
              {authMessage.text && (
                <div className={`auth-message ${authMessage.success ? 'success' : 'error'}`}>
                  {authMessage.text}
                </div>
              )}
              <button className="btn btn-primary btn-full" onClick={signIn}>
                Đăng nhập
              </button>
              <div className="auth-switch">
                Chưa có tài khoản?&nbsp;
                <button
                  className="auth-link"
                  onClick={() => { setAuthView('signup'); setAuthMessage({ text: '', success: false }); }}
                >
                  Đăng ký ngay
                </button>
              </div>
            </div>
          ) : (
            /* ── Signup form ── */
            <div className="auth-card">
              <h3>Đăng ký tài khoản</h3>
              <div className="form-group">
                <label className="form-label">Họ và tên</label>
                <input className="form-input" placeholder="Nhập họ và tên" value={signupFullName} onChange={(e) => setSignupFullName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Tên đăng nhập</label>
                <input className="form-input" placeholder="Chọn tên đăng nhập" value={signupUsername} onChange={(e) => setSignupUsername(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" placeholder="Nhập email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Mật khẩu (ít nhất 8 ký tự)</label>
                <input className="form-input" type="password" placeholder="Nhập mật khẩu" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
              </div>
              {authMessage.text && (
                <div className={`auth-message ${authMessage.success ? 'success' : 'error'}`}>
                  {authMessage.text}
                </div>
              )}
              <button className="btn btn-primary btn-full" onClick={signup}>
                Đăng ký
              </button>
              <div className="auth-switch">
                Đã có tài khoản?&nbsp;
                <button
                  className="auth-link"
                  onClick={() => { setAuthView('login'); setAuthMessage({ text: '', success: false }); }}
                >
                  Đăng nhập
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── Dashboard ── */
  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <button
            className="sidebar-toggle-btn"
            onClick={() => setSidebarOpen((o) => !o)}
            title="Mở/Đóng menu"
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <div className="header-brand">
            <span className="header-brand-icon">⚙</span>
            <div>
              <div className="header-title">Quản Lý Kỹ Thuật</div>
              <div className="header-subtitle">Technical Management System</div>
            </div>
          </div>
        </div>
        <div className="header-right">
          <button
            className="btn btn-sm btn-account"
            onClick={() => setAccountPanelOpen(true)}
            title="Thông tin tài khoản"
          >
            👤 {user.fullName}
          </button>
          <button className="btn btn-sm btn-signout" onClick={() => signOut()}>
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Body: sidebar + content */}
      <div className="app-body">
        {/* Sidebar */}
        <nav className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-section-title">Trang chủ</div>
          <button
            className={`sidebar-item ${activeView === 'home' ? 'active' : ''}`}
            onClick={() => setActiveView('home')}
          >
            <span className="sidebar-icon">🏠</span>
            <span className="sidebar-label">Trang chủ</span>
          </button>

          <div className="sidebar-section-title">Dữ liệu</div>
          {entities.map((entity) => (
            <button
              key={entity}
              className={`sidebar-item ${activeView === entity ? 'active' : ''}`}
              onClick={() => setActiveView(entity)}
            >
              <span className="sidebar-icon">{ENTITY_ICONS[entity] || '📋'}</span>
              <span className="sidebar-label">{ENTITY_LABELS[entity]}</span>
            </button>
          ))}

          {user.role === 'admin' && (
            <>
              <div className="sidebar-section-title">Quản trị</div>
              <button
                className={`sidebar-item ${activeView === 'transfer' ? 'active' : ''}`}
                onClick={() => setActiveView('transfer')}
              >
                <span className="sidebar-icon">📦</span>
                <span className="sidebar-label">Nhập/Xuất dữ liệu</span>
              </button>
            </>
          )}
        </nav>

        {/* Content */}
        <main className="content-area">
          {activeView === 'home' && (
            <HomePage user={user} onNavigate={(entity) => setActiveView(entity)} />
          )}

          {entities.includes(activeView) && (
            <EntitySection
              entity={activeView}
              entityLabel={ENTITY_LABELS[activeView]}
              credential={credential}
              canEdit={canEdit}
            />
          )}

          {activeView === 'transfer' && user.role === 'admin' && (
            <AdminDataTransfer credential={credential} />
          )}
        </main>
      </div>

      {/* Account panel overlay */}
      {accountPanelOpen && (
        <AccountPanel
          user={user}
          credential={credential}
          onClose={() => setAccountPanelOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
