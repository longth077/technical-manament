import { useEffect, useState } from "react";
import { Api } from "../services/api";
import TableForm from "./TableForm";
import StaffAssignModal from "./M2mPanel";
import { getColumnLabel, ENTITY_SCHEMAS } from "../services/entitySchema";
import { M2M_CONFIG } from "../services/entityConfig";

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function EntitySection({
  entity,
  entityLabel,
  credential,
  canEdit,
}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingRow, setEditingRow] = useState(null); // row being edited (inline)
  const [loadKey, setLoadKey] = useState(0);
  const [createFormKey, setCreateFormKey] = useState(0);
  const [editFormKey, setEditFormKey] = useState(0);
  const [showM2mModal, setShowM2mModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const loadRows = () => {
    setLoadKey((k) => k + 1);
  };

  useEffect(() => {
    let active = true;
    Api.listEntity(entity, credential)
      .then((data) => {
        if (active) {
          setRows(data.rows || []);
          setError("");
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
      const data = await Api.createEntity(entity, payload, credential);
      setShowCreate(false);
      setError("");
      setCreateFormKey((k) => k + 1);
      if (data?.row) {
        // Append new row to table and open view/detail mode so assign button is visible
        // (do NOT call loadRows here — it would reset editingRow via useEffect)
        setRows((prev) => [...prev, data.row]);
        setEditingRow(data.row);
        setIsEditMode(false);
        setEditFormKey((k) => k + 1);
      } else {
        loadRows();
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const updateRow = async (payload) => {
    if (!editingRow) return;
    try {
      await Api.updateEntity(entity, editingRow.id, payload, credential);
      setEditingRow(null);
      setIsEditMode(false);
      setShowM2mModal(false);
      setError("");
      setEditFormKey((k) => k + 1);
      loadRows();
    } catch (e) {
      setError(e.message);
    }
  };

  const deleteRow = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa dòng này?")) return;
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
    setError("");
    setEditingRow(null);
    setIsEditMode(false);
    setShowM2mModal(false);
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
    setError("");
    setCreateFormKey((k) => k + 1);
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setIsEditMode(false);
    setShowM2mModal(false);
    setError("");
    setEditFormKey((k) => k + 1);
  };

  return (
    <section className="entity-section">
      <div className="panel">
        <div className="panel-header">
          <h3>{entityLabel || entity}</h3>
          <div className="panel-header-actions">
            <button className="btn btn-sm btn-outline" onClick={exportExcel}>
              📊 Xuất Excel
            </button>
            <button className="btn btn-sm btn-outline" onClick={loadRows}>
              ↻ Làm mới
            </button>
            {canEdit && (
              <button
                className="btn btn-sm btn-primary"
                onClick={handleToggleCreate}
              >
                {showCreate ? "✕ Đóng" : "+ Thêm mới"}
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="error-msg" style={{ margin: "0.75rem 1.25rem 0" }}>
            {error}
          </div>
        )}

        {/* --- CREATE FORM --- */}
        {canEdit && showCreate && (
          <div className="inline-form-wrap">
            <TableForm
              key={createFormKey}
              entity={entity}
              onSubmit={createRow}
              onCancel={handleCancelCreate}
              submitLabel="Tạo mới"
              credential={credential}
            />
          </div>
        )}

        {/* --- DETAIL / EDIT FORM (inline, below header) --- */}
        {editingRow && !showCreate && (
          <div className="inline-form-wrap">
            <div className="inline-form-title">
              {isEditMode
                ? `Sửa dòng #${editingRow.id}`
                : `Chi tiết #${editingRow.id}`}
            </div>
            <TableForm
              key={`${editingRow.id}-${editFormKey}`}
              entity={entity}
              initialData={editingRow}
              onSubmit={isEditMode ? updateRow : undefined}
              onCancel={isEditMode ? handleCancelEdit : undefined}
              submitLabel="Cập nhật"
              credential={credential}
              readOnly={!isEditMode || !canEdit}
            />
            {(!isEditMode || !canEdit) && (
              <div className="table-form-actions">
                {canEdit && (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => setIsEditMode(true)}
                  >
                    ✏️ Chỉnh sửa
                  </button>
                )}
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={handleCancelEdit}
                >
                  ✕ Đóng
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- ASSIGNMENT BUTTON + MODAL --- */}
        {canEdit && editingRow && !showCreate && M2M_CONFIG[entity] && (
          <div className="m2m-assign-bar">
            <button
              className="btn btn-sm btn-primary"
              onClick={() => setShowM2mModal(true)}
            >
              🔗 Phân công
            </button>
          </div>
        )}
        {showM2mModal && editingRow && M2M_CONFIG[entity] && (
          <StaffAssignModal
            staffId={editingRow.id}
            configs={M2M_CONFIG[entity]}
            credential={credential}
            canEdit={canEdit}
            entityLabel={entityLabel}
            onClose={() => setShowM2mModal(false)}
          />
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
                    {columns.map((c) => (
                      <th key={c}>{getColumnLabel(entity, c)}</th>
                    ))}
                    {canEdit && <th>Thao tác</th>}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const nameCol = ENTITY_SCHEMAS[entity]?.[0]?.key;
                    return (
                    <tr
                      key={row.id ?? JSON.stringify(row)}
                      className={editingRow?.id === row.id ? "row-editing" : ""}
                    >
                      {columns.map((c) => (
                        <td key={c}>
                          {c === nameCol ? (
                            <button
                              className="row-name-link"
                              onClick={() => {
                                setEditingRow(row);
                                setIsEditMode(false);
                                setShowCreate(false);
                                setCreateFormKey((k) => k + 1);
                                setShowM2mModal(false);
                                setError("");
                              }}
                            >
                              {String(row[c] ?? "")}
                            </button>
                          ) : (
                            String(row[c] ?? "")
                          )}
                        </td>
                      ))}
                      {canEdit && (
                        <td>
                          <div className="td-actions">
                            <button
                              className="btn btn-sm btn-outline"
                              onClick={() => {
                                setEditingRow(row);
                                setIsEditMode(true);
                                setShowM2mModal(false);
                                setShowCreate(false);
                                setCreateFormKey((k) => k + 1);
                                setError("");
                              }}
                            >
                              Sửa
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => deleteRow(row.id)}
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
