import { useState } from 'react';
import { Api } from '../services/api';

function downloadText(content, filename) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminDataTransfer({ credential }) {
  const [sqlInput, setSqlInput] = useState('');
  const [excelBase64, setExcelBase64] = useState('');
  const [message, setMessage] = useState('');

  const exportSql = async () => {
    try {
      const sql = await Api.exportAllSql(credential);
      downloadText(sql, 'technical-management.sql');
      setMessage('Xuất SQL thành công');
    } catch (e) {
      setMessage(e.message);
    }
  };

  const exportExcel = async () => {
    try {
      const blob = await Api.exportAllExcel(credential);
      downloadBlob(blob, 'technical-management.xlsx');
      setMessage('Xuất Excel thành công');
    } catch (e) {
      setMessage(e.message);
    }
  };

  const importSql = async () => {
    try {
      await Api.importSql(sqlInput, credential);
      setMessage('Nhập SQL thành công');
      setSqlInput('');
    } catch (e) {
      setMessage(e.message);
    }
  };

  const importExcel = async () => {
    try {
      await Api.importExcel(excelBase64, credential);
      setMessage('Nhập Excel thành công');
      setExcelBase64('');
    } catch (e) {
      setMessage(e.message);
    }
  };

  return (
    <section className="admin-section">
      <div className="panel">
        <div className="panel-header">
          <h3>📦 Nhập / Xuất dữ liệu</h3>
        </div>
        <div className="panel-body">
          {message && <div className="status-msg">{message}</div>}

          {/* Export Section */}
          <div className="transfer-grid">
            <div className="transfer-card">
              <h4>📤 Xuất toàn bộ dữ liệu</h4>
              <p>Tải toàn bộ dữ liệu hệ thống dưới dạng SQL hoặc Excel.</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary" onClick={exportSql}>Xuất SQL</button>
                <button className="btn btn-success" onClick={exportExcel}>Xuất Excel</button>
              </div>
            </div>

            <div className="transfer-card">
              <h4>📥 Nhập dữ liệu SQL</h4>
              <p>Dán nội dung SQL đã xuất vào ô bên dưới.</p>
              <textarea
                className="form-textarea"
                rows={5}
                value={sqlInput}
                onChange={(e) => setSqlInput(e.target.value)}
                placeholder="Dán nội dung SQL ở đây..."
              />
              <button className="btn btn-primary btn-sm" onClick={importSql} disabled={!sqlInput.trim()}>Nhập SQL</button>
            </div>
          </div>

          <div className="transfer-card" style={{ marginTop: '1.25rem' }}>
            <h4>📥 Nhập dữ liệu Excel (base64)</h4>
            <p>Dán nội dung Excel đã mã hóa base64 vào ô bên dưới.</p>
            <textarea
              className="form-textarea"
              rows={4}
              value={excelBase64}
              onChange={(e) => setExcelBase64(e.target.value)}
              placeholder="Dán nội dung base64 ở đây..."
            />
            <button className="btn btn-primary btn-sm" onClick={importExcel} disabled={!excelBase64.trim()}>Nhập Excel</button>
          </div>
        </div>
      </div>
    </section>
  );
}
