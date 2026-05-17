import { useEffect, useMemo, useState } from "react";
import EntitySection from "./components/EntitySection";
import AdminDataTransfer from "./components/AdminDataTransfer";
import AdminReports from "./components/AdminReports";
import HomePage from "./components/HomePage";
import AccountPanel from "./components/AccountPanel";
import UnitOverviewPage from "./components/UnitOverviewPage";
import WarehouseGallery from "./components/WarehouseGallery";
import WarehouseImageOverview from "./components/WarehouseImageOverview";
import { Api } from "./services/api";
import { ENTITY_LABELS, ENTITY_ICONS } from "./services/entityConfig";
import "./App.css";

const entities = Object.keys(ENTITY_LABELS);

/* Session duration: 1 hour */
const SESSION_DURATION_MS = 1 * 60 * 60 * 1000;

function App() {
  /* ── Auth state ── */
  const [authView, setAuthView] = useState("login"); // 'login' | 'signup'
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [signupFullName, setSignupFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [authMessage, setAuthMessage] = useState({ text: "", success: false });

  /* ── App state ── */
  const [credential, setCredential] = useState(
    localStorage.getItem("credential") || "",
  );
  const [user, setUser] = useState(null);
  const [sessionRestoring, setSessionRestoring] = useState(
    () => !!localStorage.getItem("credential"),
  );
  const [activeView, setActiveView] = useState("home"); // 'home' | entity key | 'transfer'
  const [warehouseGalleryTarget, setWarehouseGalleryTarget] = useState(null); // warehouse row
  const [galleryReturnView, setGalleryReturnView] = useState("warehouses"); // where Back navigates to
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [accountPanelOpen, setAccountPanelOpen] = useState(false);
  const [sessionMsg, setSessionMsg] = useState("");
  const [forgotOpen, setForgotOpen] = useState(false);

  const canEdit = useMemo(() => user && user.role !== "readonly", [user]);

  /* ── Sign in ── */
  const signIn = async () => {
    if (!loginId || !loginPw) {
      setAuthMessage({
        text: "Vui lòng nhập tên đăng nhập/email và mật khẩu",
        success: false,
      });
      return;
    }
    const encoded = btoa(`${loginId}:${loginPw}`);
    try {
      const data = await Api.me(encoded);
      setCredential(encoded);
      localStorage.setItem("credential", encoded);
      localStorage.setItem("loginTime", Date.now().toString());
      setUser(data.user);
      setAuthMessage({ text: "", success: false });
      setSessionMsg("");
    } catch (e) {
      setAuthMessage({ text: e.message, success: false });
    }
  };

  /* ── Sign out ── */
  const signOut = (msg = "") => {
    localStorage.removeItem("credential");
    localStorage.removeItem("loginTime");
    setCredential("");
    setUser(null);
    setActiveView("home");
    setWarehouseGalleryTarget(null);
    setGalleryReturnView("warehouses");
    setSessionMsg(msg);
  };

  /* ── Sign up ── */
  const signup = async () => {
    if (
      !signupUsername ||
      !signupEmail ||
      !signupPassword ||
      !signupConfirmPassword ||
      !signupFullName
    ) {
      setAuthMessage({
        text: "Vui lòng điền đầy đủ tất cả các trường",
        success: false,
      });
      return;
    }
    if (signupPassword.length < 8) {
      setAuthMessage({
        text: "Mật khẩu phải có ít nhất 8 ký tự",
        success: false,
      });
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setAuthMessage({ text: "Mật khẩu xác nhận không khớp", success: false });
      return;
    }
    try {
      await Api.signup({
        username: signupUsername,
        email: signupEmail,
        password: signupPassword,
        fullName: signupFullName,
      });
      setAuthMessage({
        text: "Đăng ký thành công! Vui lòng chờ quản trị viên duyệt tài khoản.",
        success: true,
      });
      setSignupFullName("");
      setSignupEmail("");
      setSignupUsername("");
      setSignupPassword("");
      setSignupConfirmPassword("");
    } catch (e) {
      setAuthMessage({ text: e.message, success: false });
    }
  };

  /* ── Session restore on mount ── */
  useEffect(() => {
    if (!credential) {
      setSessionRestoring(false);
      return;
    }
    let active = true;
    Api.me(credential)
      .then((data) => {
        if (active) setUser(data.user);
      })
      .catch(() => {
        if (!active) return;
        signOut();
      })
      .finally(() => {
        if (active) setSessionRestoring(false);
      });
    return () => {
      active = false;
    };
  }, [credential]);

  /* ── Session timeout: check every minute ── */
  useEffect(() => {
    if (!credential) return;
    const check = () => {
      const loginTime = localStorage.getItem("loginTime");
      if (
        loginTime &&
        Date.now() - parseInt(loginTime, 10) > SESSION_DURATION_MS
      ) {
        signOut("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
      }
    };
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, [credential]);

  /* ── Auth pages ── */
  if (sessionRestoring) return null;

  if (!user) {
    return (
      <>
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

            {authView === "login" ? (
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
                    onKeyDown={(e) => e.key === "Enter" && signIn()}
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <div className="form-label-row">
                    <label className="form-label">Mật khẩu</label>
                    <button
                      type="button"
                      className="auth-link auth-link-sm"
                      onClick={() => setForgotOpen(true)}
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={loginPw}
                    onChange={(e) => setLoginPw(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && signIn()}
                  />
                </div>
                {authMessage.text && (
                  <div
                    className={`auth-message ${authMessage.success ? "success" : "error"}`}
                  >
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
                    onClick={() => {
                      setAuthView("signup");
                      setAuthMessage({ text: "", success: false });
                      setSignupConfirmPassword("");
                    }}
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
                  <input
                    className="form-input"
                    placeholder="Nhập họ và tên"
                    value={signupFullName}
                    onChange={(e) => setSignupFullName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tên đăng nhập</label>
                  <input
                    className="form-input"
                    placeholder="Chọn tên đăng nhập"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="Nhập email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Mật khẩu (ít nhất 8 ký tự)
                  </label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Xác nhận mật khẩu</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  />
                </div>
                {authMessage.text && (
                  <div
                    className={`auth-message ${authMessage.success ? "success" : "error"}`}
                  >
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
                    onClick={() => {
                      setAuthView("login");
                      setAuthMessage({ text: "", success: false });
                      setSignupConfirmPassword("");
                    }}
                  >
                    Đăng nhập
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Forgot password modal */}
        {forgotOpen && (
          <div className="modal-overlay" onClick={() => setForgotOpen(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h4>🔑 Quên mật khẩu</h4>
              </div>
              <div className="modal-body">
                <p>Bạn không thể tự đặt lại mật khẩu qua hệ thống này.</p>
                <p style={{ marginTop: "0.6rem" }}>
                  Vui lòng liên hệ <strong>quản trị viên</strong> để được hỗ trợ
                  đặt lại mật khẩu.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setForgotOpen(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </>
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
        <nav className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <div className="sidebar-section-title">Trang chủ</div>
          <button
            className={`sidebar-item ${activeView === "home" ? "active" : ""}`}
            onClick={() => setActiveView("home")}
          >
            <span className="sidebar-icon">🏠</span>
            <span className="sidebar-label">Trang chủ</span>
          </button>

          <div className="sidebar-section-title">Thông tin</div>
          <button
            className={`sidebar-item ${activeView === "unit_overview" ? "active" : ""}`}
            onClick={() => setActiveView("unit_overview")}
          >
            <span className="sidebar-icon">🏢</span>
            <span className="sidebar-label">Thông tin đơn vị</span>
          </button>

          <div className="sidebar-section-title">Dữ liệu</div>
          {entities.map((entity) => (
            <button
              key={entity}
              className={`sidebar-item ${activeView === entity ? "active" : ""}`}
              onClick={() => {
                setActiveView(entity);
                setWarehouseGalleryTarget(null);
              }}
            >
              <span className="sidebar-icon">
                {ENTITY_ICONS[entity] || "📋"}
              </span>
              <span className="sidebar-label">{ENTITY_LABELS[entity]}</span>
            </button>
          ))}

          {user.role === "admin" || user.role === "user" ? (
            <>
              <div className="sidebar-section-title">Báo cáo</div>
              <button
                className={`sidebar-item ${activeView === "reports" ? "active" : ""}`}
                onClick={() => setActiveView("reports")}
              >
                <span className="sidebar-icon">📊</span>
                <span className="sidebar-label">Xuất báo cáo Excel</span>
              </button>
            </>
          ) : null}

          {user.role === "admin" && (
            <>
              <div className="sidebar-section-title">Quản trị</div>
              <button
                className={`sidebar-item ${activeView === "transfer" ? "active" : ""}`}
                onClick={() => setActiveView("transfer")}
              >
                <span className="sidebar-icon">📦</span>
                <span className="sidebar-label">Nhập/Xuất dữ liệu</span>
              </button>
            </>
          )}
        </nav>

        {/* Content */}
        <main className="content-area">
          {activeView === "home" && (
            <HomePage
              user={user}
              onNavigate={(entity) => setActiveView(entity)}
            />
          )}

          {entities.includes(activeView) &&
            activeView !== "warehouse_gallery" &&
            activeView !== "warehouse_images" && (
              <EntitySection
                entity={activeView}
                entityLabel={ENTITY_LABELS[activeView]}
                credential={credential}
                canEdit={canEdit}
                onViewGallery={
                  activeView === "warehouses"
                    ? (row) => {
                        setWarehouseGalleryTarget(row);
                        setGalleryReturnView("warehouses");
                        setActiveView("warehouse_gallery");
                      }
                    : undefined
                }
              />
            )}

          {activeView === "warehouse_images" && !warehouseGalleryTarget && (
            <WarehouseImageOverview
              credential={credential}
              canEdit={canEdit}
              onViewGallery={(row) => {
                setWarehouseGalleryTarget(row);
                setGalleryReturnView("warehouse_images");
                setActiveView("warehouse_gallery");
              }}
            />
          )}

          {activeView === "warehouse_gallery" && warehouseGalleryTarget && (
            <WarehouseGallery
              warehouse={warehouseGalleryTarget}
              credential={credential}
              canEdit={canEdit}
              onBack={() => {
                setActiveView(galleryReturnView);
                setWarehouseGalleryTarget(null);
              }}
            />
          )}

          {activeView === "unit_overview" && (
            <UnitOverviewPage credential={credential} canEdit={canEdit} />
          )}

          {activeView === "reports" &&
            (user.role === "admin" || user.role === "user") && (
              <AdminReports credential={credential} />
            )}

          {activeView === "transfer" && user.role === "admin" && (
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
          onSignOut={() => signOut()}
        />
      )}
    </div>
  );
}

export default App;
