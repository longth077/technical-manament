import { useState, useEffect } from 'react';
import * as overviewService from '../services/overviewService';
import Alert from '../components/Alert';

const FIELDS = [
  { key: 'location', label: 'Vị trí' },
  { key: 'area', label: 'Diện tích' },
  { key: 'stationSystem', label: 'Hệ thống trạm xưởng' },
  { key: 'fenceSystem', label: 'Hệ thống tường rào' },
  { key: 'roadSystem', label: 'Hệ thống đường giao thông' },
  { key: 'fireSystem', label: 'Hệ thống cứu hoả' },
  { key: 'terrainMap', label: 'Địa hình bản đồ' },
  { key: 'landCertificate', label: 'Giấy CNQSD đất' },
];

export default function OverviewPage() {
  const [form, setForm] = useState({});
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    overviewService.getOverview().then(({ data }) => {
      if (data) setForm(data);
      setLoading(false);
    });
  }, []);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const { error } = await overviewService.saveOverview(form);
    if (error) {
      setAlert({ message: error, type: 'error' });
    } else {
      setAlert({ message: 'Lưu thành công!', type: 'success' });
    }
  };

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="page">
      <h2>Tổng Quan Khu Kỹ Thuật</h2>

      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="overview-form">
        {FIELDS.map((f) => (
          <div className="form-group" key={f.key}>
            <label>{f.label}</label>
            <textarea
              value={form[f.key] || ''}
              onChange={(e) => handleChange(f.key, e.target.value)}
              rows={3}
            />
          </div>
        ))}
        <button className="btn btn-primary" onClick={handleSave}>
          Lưu thông tin
        </button>
      </div>
    </div>
  );
}
