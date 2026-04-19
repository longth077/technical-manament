import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Tổng Quan' },
  { to: '/dashboard/staff', label: 'Cán Bộ CMKT' },
  { to: '/dashboard/warehouses', label: 'Kho Trạm Xưởng' },
  { to: '/dashboard/weapons', label: 'Vũ Khí TB' },
  { to: '/dashboard/tech-equipment', label: 'Trang Thiết Bị KT' },
  { to: '/dashboard/vehicles', label: 'Phương Tiện' },
  { to: '/dashboard/materials', label: 'Vật Tư' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-title">⚙️ Quản Lý Kỹ Thuật</div>
        <div className="header-user">
          <span>{user?.fullName || user?.username}</span>
          <button className="btn btn-danger btn-sm" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </header>
      <div className="layout-body">
        <nav className="sidebar">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) =>
                'sidebar-link' + (isActive ? ' active' : '')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
