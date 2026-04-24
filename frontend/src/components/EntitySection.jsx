import { useEffect, useState } from 'react';
import { Api } from '../services/api';
import TableForm from './TableForm';
import { getColumnLabel } from '../services/entitySchema';

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
  const [showCreate, setShowCreate] = useState(false);
  const [editingRow, setEditingRow] = useState(null); // row being edited (inline)
  const [loadKey, setLoadKey] = useState(0);
  const [createFormKey, setCreateFormKey] = useState(0);
  const [editFormKey, setEditFormKey] = useState(0);

  const loadRows = () => {
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
          setEditingRow(null);
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

  const createRow = async (payload) => {
    try {
      await Api.createEntity(entity, payload, credential);
      setShowCreate(false);
      setError('');
      setCreateFormKey((k) => k + 1);
      loadRows();
    } catch (e) {
      setError(e.message);
    }
  };

  const updateRow = async (payload) => {
    if (!editingRow) return;
    try {
      await Api.updateEntity(entity, editingRow.id, payload, credential);
      setEditingRow(null);
      setError('');
      setEditFormKey((k) => k + 1);
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

  const handleToggleCreate = () => {
    setError('');
    setEditingRow(null);
    setEditFormKey((k) => k + 1);
    if (showCreate) {
      setShowCreate(false);
      setCreateFormKey((k) => k + 1);
      return;
    }
    setShowCreate(true);
  };

  const handleCancelCreate = () => {
    setShowCreate(false);
    setError('');
    setCreateFormKey((k) => k + 1);
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setError('');
    setEditFormKey((k) => k + 1);
  };

  return (
    <section className="entity-section">
      <div className="panel">
        <div className="panel-header">
          <h3>{entityLabel || entity}</h3>
          <div className="panel-header-actions">
            <button className="btn btn-sm btn-outline" onClick={exportExcel}>📊 Xuất Excel</button>
            <button className="btn btn-sm btn-outline" onClick={loadRows}>↻ Làm mới</button>
            {canEdit && (
              <button
                className="btn btn-sm btn-primary"
                onClick={handleToggleCreate}
              >
                {showCreate ? '✕ Đóng' : '+ Thêm mới'}
              </button>
            )}
          </div>
        </div>

        {error && <div className="error-msg" style={{ margin: '0.75rem 1.25rem 0' }}>{error}</div>}

        {/* --- CREATE FORM --- */}
        {canEdit && showCreate && (
          <div className="inline-form-wrap">
            <TableForm
              key={createFormKey}
              entity={entity}
              onSubmit={createRow}
              onCancel={handleCancelCreate}
              submitLabel="Tạo mới"
            />
          </div>
        )}

        {/* --- EDIT FORM (inline, below header) --- */}
        {canEdit && editingRow && !showCreate && (
          <div className="inline-form-wrap">
            <div className="inline-form-title">Sửa dòng #{editingRow.id}</div>
            <TableForm
              key={`${editingRow.id}-${editFormKey}`}
              entity={entity}
              initialData={editingRow}
              onSubmit={updateRow}
              onCancel={handleCancelEdit}
              submitLabel="Cập nhật"
            />
          </div>
        )}

        {/* --- DATA TABLE --- */}
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
                    {columns.map((c) => <th key={c}>{getColumnLabel(entity, c)}</th>)}
                    {canEdit && <th>Thao tác</th>}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.id ?? JSON.stringify(row)}
                      className={editingRow?.id === row.id ? 'row-editing' : ''}
                    >
                      {columns.map((c) => <td key={c}>{String(row[c] ?? '')}</td>)}
                      {canEdit && (
                        <td>
                          <div className="td-actions">
                            <button
                              className="btn btn-sm btn-outline"
                              onClick={() => {
                                setEditingRow(row);
                                setShowCreate(false);
                                setCreateFormKey((k) => k + 1);
                                setError('');
                              }}
                            >
                              Sửa
                            </button>
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
