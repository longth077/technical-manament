import { useEffect, useState } from 'react';
import { Api } from '../services/api';

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function EntitySection({ entity, entityLabel, credential, canEdit }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState('{}');
  const [showCreate, setShowCreate] = useState(false);
  const [loadKey, setLoadKey] = useState(0);

  const loadRows = async () => {
    setLoadKey((k) => k + 1);
  };

  useEffect(() => {
    let active = true;
    Api.listEntity(entity, credential)
      .then((data) => {
        if (active) {
          setRows(data.rows || []);
          setError('');
          setShowCreate(false);
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [entity, credential, loadKey]);

  const createRow = async () => {
    try {
      const payload = JSON.parse(draft);
      await Api.createEntity(entity, payload, credential);
      setDraft('{}');
      setShowCreate(false);
      loadRows();
    } catch (e) {
      setError(e.message);
    }
  };

  const updateRow = async (row) => {
    const input = prompt('Edit JSON row', JSON.stringify(row, null, 2));
    if (!input) return;
    try {
      const payload = JSON.parse(input);
      delete payload.id;
      await Api.updateEntity(entity, row.id, payload, credential);
      loadRows();
    } catch (e) {
      setError(e.message);
    }
  };

  const deleteRow = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa dòng này?')) return;
    try {
      await Api.deleteEntity(entity, id, credential);
      loadRows();
    } catch (e) {
      setError(e.message);
    }
  };

  const exportExcel = async () => {
    try {
      const blob = await Api.exportEntityExcel(entity, credential);
      downloadBlob(blob, `${entity}-report.xlsx`);
    } catch (e) {
      setError(e.message);
    }
  };

  const columns = rows.length ? Object.keys(rows[0]) : [];

  return (
    <section className="entity-section">
      <div className="panel">
        <div className="panel-header">
          <h3>{entityLabel || entity}</h3>
          <div className="panel-header-actions">
            <button className="btn btn-sm btn-outline" onClick={exportExcel}>📊 Xuất Excel</button>
            <button className="btn btn-sm btn-outline" onClick={loadRows}>↻ Làm mới</button>
            {canEdit && (
              <button className="btn btn-sm btn-primary" onClick={() => setShowCreate(!showCreate)}>
                {showCreate ? '✕ Đóng' : '+ Thêm mới'}
              </button>
            )}
          </div>
        </div>

        {error && <div className="error-msg" style={{ margin: '0.75rem 1.25rem 0' }}>{error}</div>}

        {canEdit && showCreate && (
          <div className="json-editor" style={{ margin: '1rem 1.25rem 0' }}>
            <label>Nhập dữ liệu JSON:</label>
            <textarea className="form-textarea" value={draft} onChange={(e) => setDraft(e.target.value)} rows={6} />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-sm btn-success" onClick={createRow}>Tạo mới</button>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowCreate(false)}>Hủy</button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading-bar">Đang tải dữ liệu...</div>
        ) : rows.length === 0 ? (
          <div className="empty-state">Chưa có dữ liệu</div>
        ) : (
          <div className="panel-body-flush">
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    {columns.map((c) => <th key={c}>{c}</th>)}
                    {canEdit && <th>Thao tác</th>}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id ?? JSON.stringify(row)}>
                      {columns.map((c) => <td key={c}>{String(row[c] ?? '')}</td>)}
                      {canEdit && (
                        <td>
                          <div className="td-actions">
                            <button className="btn btn-sm btn-outline" onClick={() => updateRow(row)}>Sửa</button>
                            <button className="btn btn-sm btn-danger" onClick={() => deleteRow(row.id)}>Xóa</button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
