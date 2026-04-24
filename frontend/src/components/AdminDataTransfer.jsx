import { useRef, useState } from 'react';
import { Api } from '../services/api';

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminDataTransfer({ credential }) {
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);

  const notify = (msg, error = false) => {
    setMessage(msg);
    setIsError(error);
  };

  const exportExcel = async () => {
    try {
      const blob = await Api.exportAllExcel(credential);
      downloadBlob(blob, 'quan-ly-ky-thuat.xlsx');
      notify('Xuất Excel thành công');
    } catch (e) {
      notify(e.message, true);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      notify('Vui lòng chọn file Excel (.xlsx hoặc .xls)', true);
      return;
    }

    setImporting(true);
    notify('');
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      await Api.importExcel(base64, credential);
      notify('Nhập dữ liệu Excel thành công');
    } catch (e) {
      notify(e.message, true);
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <section className="admin-section">
      <div className="panel">
        <div className="panel-header">
          <h3>📦 Nhập / Xuất dữ liệu</h3>
        </div>
        <div className="panel-body">
          {message && (
            <div className={isError ? 'error-msg' : 'status-msg'} style={{ marginBottom: '1rem' }}>
              {message}
            </div>
          )}

          <div className="transfer-grid">
            {/* Export */}
            <div className="transfer-card">
              <h4>📤 Xuất dữ liệu</h4>
              <p>Tải toàn bộ dữ liệu hệ thống ra file Excel.</p>
              <button className="btn btn-success" onClick={exportExcel}>
                📊 Xuất Excel
              </button>
            </div>

            {/* Import */}
            <div className="transfer-card">
              <h4>📥 Nhập dữ liệu Excel</h4>
              <p>Chọn file Excel (.xlsx) đã được xuất từ hệ thống để nhập lại dữ liệu.</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="file-input"
                onChange={handleFileSelect}
                disabled={importing}
              />
              {importing && <div className="loading-bar" style={{ padding: '0.5rem 0' }}>Đang nhập dữ liệu...</div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
