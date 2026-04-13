import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import OverviewPage from './OverviewPage';
import StaffPage from './StaffPage';
import WarehousesPage from './WarehousesPage';
import WeaponsPage from './WeaponsPage';
import TechEquipmentPage from './TechEquipmentPage';
import VehiclesPage from './VehiclesPage';
import MaterialsPage from './MaterialsPage';

function WelcomePanel() {
  const { user } = useAuth();
  return (
    <div className="welcome-panel">
      <h2>Chào mừng, {user?.fullName || user?.username}!</h2>
      <p>Hệ thống Quản Lý Kỹ Thuật</p>
      <div className="welcome-info">
        <p>Sử dụng menu bên trái để điều hướng đến các chức năng quản lý.</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Layout>
      <Routes>
        <Route index element={<WelcomePanel />} />
        <Route path="overview" element={<OverviewPage />} />
        <Route path="staff" element={<StaffPage />} />
        <Route path="warehouses" element={<WarehousesPage />} />
        <Route path="weapons" element={<WeaponsPage />} />
        <Route path="tech-equipment" element={<TechEquipmentPage />} />
        <Route path="vehicles" element={<VehiclesPage />} />
        <Route path="materials" element={<MaterialsPage />} />
      </Routes>
    </Layout>
  );
}
