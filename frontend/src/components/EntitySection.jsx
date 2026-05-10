import { useEffect, useMemo, useState } from "react";
import { Api } from "../services/api";
import TableForm from "./TableForm";
import StaffAssignModal from "./M2mPanel";
import { getColumnLabel, ENTITY_SCHEMAS } from "../services/entitySchema";
import {
  M2M_CONFIG,
  ENTITY_FILTER_FIELDS,
  FK_DISPLAY,
  KEEPER_COLUMN_CONFIG,
  ENTITY_LABELS,
} from "../services/entityConfig";

/** Dropdown loaded from a sibling entity (FK exact-match, backend-filtered). */
function EntitySelect({
  lookupEntity,
  lookupLabelField,
  value,
  onChange,
  credential,
}) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Api.listEntity(lookupEntity, credential)
      .then((data) => {
        if (active) setOptions(data.rows || []);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [lookupEntity, credential]);

  return (
    <select
      className="filter-input filter-select"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={loading}
    >
      <option value="">-- Tất cả --</option>
      {options.map((row) => (
        <option key={row.id} value={String(row.id)}>
          {row[lookupLabelField] ?? row.id}
        </option>
      ))}
    </select>
  );
}

/** Dropdown loaded from enum constants (client-side exact-match). */
function EnumFilterSelect({ enumType, value, onChange, credential }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Api.listEnumByType(enumType, credential)
      .then((data) => {
        if (active) setOptions(data.rows || []);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [enumType, credential]);

  return (
    <select
      className="filter-input filter-select"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={loading}
    >
      <option value="">-- Tất cả --</option>
      {options.map((opt) => (
        <option key={opt.id} value={String(opt.id)}>
          {opt.enum}
        </option>
      ))}
    </select>
  );
}

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

  // ── Filter state ──────────────────────────────────────────────────────────
  const filterFields = useMemo(
    () => ENTITY_FILTER_FIELDS[entity] || [],
    [entity],
  );
  // entity_select → sent to backend (cause re-fetch)
  const [backendFilters, setBackendFilters] = useState({});
  // text / number / enum_filter → client-side only
  const [clientFilters, setClientFilters] = useState({});

  // Reset filters + loading during render when entity changes (avoids setState-in-effect).
  const [prevEntity, setPrevEntity] = useState(entity);
  if (prevEntity !== entity) {
    setPrevEntity(entity);
    setBackendFilters({});
    setClientFilters({});
    setLoading(true);
  }

  const hasActiveFilters =
    Object.values(backendFilters).some((v) => v !== "") ||
    Object.values(clientFilters).some((v) => v !== "");

  const clearFilters = () => {
    setBackendFilters({});
    setClientFilters({});
  };

  const handleFilterChange = (field, val) => {
    if (field.type === "entity_select") {
      setLoading(true); // signal loading before the new backend filter triggers a re-fetch
      setBackendFilters((prev) => ({ ...prev, [field.key]: val }));
    } else {
      setClientFilters((prev) => ({ ...prev, [field.key]: val }));
    }
  };

  // ── FK display lookup ─────────────────────────────────────────────────────
  const [fkLookups, setFkLookups] = useState({});

  useEffect(() => {
    if (!rows.length) return;
    const fkCols = Object.keys(FK_DISPLAY).filter((col) => col in rows[0]);
    if (!fkCols.length) return;
    let active = true;
    Promise.all(
      fkCols.map((col) =>
        Api.listEntity(FK_DISPLAY[col].entity, credential)
          .then((data) => ({ col, rows: data.rows || [] }))
          .catch(() => ({ col, rows: [] })),
      ),
    ).then((results) => {
      if (!active) return;
      const next = {};
      for (const { col, rows: lr } of results) {
        const map = {};
        for (const r of lr)
          map[String(r.id)] = r[FK_DISPLAY[col].labelField] ?? r.id;
        next[col] = map;
      }
      setFkLookups((prev) => ({ ...prev, ...next }));
    });
    return () => {
      active = false;
    };
  }, [rows, credential]);

  // ── Keeper lookups (junction table + staffs) ──────────────────────────────
  // keeperColCfg: the KEEPER_COLUMN_CONFIG entry that applies to the current entity's rows
  const keeperColCfg = useMemo(() => {
    if (!rows.length) return null;
    const col = Object.keys(KEEPER_COLUMN_CONFIG).find((k) => k in rows[0]);
    return col ? { col, ...KEEPER_COLUMN_CONFIG[col] } : null;
  }, [rows]);

  // keepersByRowId: { [rowId]: [ { staffName, isMain } ] }
  const [keepersByRowId, setKeepersByRowId] = useState({});
  const [staffMap, setStaffMap] = useState({});

  useEffect(() => {
    if (!keeperColCfg || !rows.length) { setKeepersByRowId({}); return; }
    let active = true;
    const { junctionEntity, junctionFkField, junctionStaffField, isMainField, staffLabelField } = keeperColCfg;

    Promise.all([
      Api.listEntity(junctionEntity, credential).catch(() => ({ rows: [] })),
      Api.listEntity("staffs", credential).catch(() => ({ rows: [] })),
    ]).then(([junctionData, staffsData]) => {
      if (!active) return;
      const jRows = junctionData.rows || [];
      const sRows = staffsData.rows || [];

      const sMap = {};
      for (const s of sRows) sMap[String(s.id)] = s[staffLabelField] ?? `ID:${s.id}`;
      setStaffMap(sMap);

      const byId = {};
      for (const j of jRows) {
        const rid = String(j[junctionFkField]);
        if (!byId[rid]) byId[rid] = [];
        byId[rid].push({ staffName: sMap[String(j[junctionStaffField])] ?? `ID:${j[junctionStaffField]}`, isMain: !!j[isMainField] });
      }
      // sort: main first
      for (const rid of Object.keys(byId)) byId[rid].sort((a, b) => b.isMain - a.isMain);
      setKeepersByRowId(byId);
    });
    return () => { active = false; };
  }, [keeperColCfg, rows, credential, loadKey]);

  const loadRows = () => {
    setLoading(true); // OK: called from event handler
    setLoadKey((k) => k + 1);
  };

  useEffect(() => {
    let active = true;
    Api.listEntity(entity, credential, backendFilters)
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
  }, [entity, credential, loadKey, backendFilters]);

  // ── Client-side filtered rows ─────────────────────────────────────────────
  const displayedRows = useMemo(() => {
    const active = filterFields.filter(
      (f) =>
        f.type !== "entity_select" &&
        clientFilters[f.key] &&
        clientFilters[f.key] !== "",
    );
    if (!active.length) return rows;
    return rows.filter((row) =>
      active.every((f) => {
        if (f.type === "enum_filter")
          return String(row[f.key]) === String(clientFilters[f.key]);
        return String(row[f.key] ?? "")
          .toLowerCase()
          .includes(String(clientFilters[f.key]).toLowerCase());
      }),
    );
  }, [rows, clientFilters, filterFields]);

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

  const [exporting, setExporting] = useState(false);

  const exportExcel = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const blob = await Api.exportEntityExcel(entity, credential, backendFilters);
      const label = ENTITY_LABELS[entity] || entity;
      const now = new Date();
      const dateTag = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
      downloadBlob(blob, `bao-cao-${label}-${dateTag}.xlsx`);
    } catch (e) {
      setError(e.message);
    } finally {
      setExporting(false);
    }
  };

  const columns = rows.length ? Object.keys(rows[0]) : [];

  const getColHeader = (col) => {
    if (KEEPER_COLUMN_CONFIG[col]) return KEEPER_COLUMN_CONFIG[col].columnLabel;
    return FK_DISPLAY[col] ? FK_DISPLAY[col].columnLabel : getColumnLabel(entity, col);
  };

  const getCellDisplay = (col, val) =>
    fkLookups[col]
      ? (fkLookups[col][String(val)] ?? String(val ?? ""))
      : String(val ?? "");

  /** Renders keeper badges for a warehouse row in the table. */
  const renderKeeperCell = (rowId) => {
    const keepers = keepersByRowId[String(rowId)];
    if (!keepers || keepers.length === 0) return <span className="text-muted">—</span>;
    return (
      <div className="keeper-cell">
        {keepers.map((k, i) => (
          <span key={i} className={`keeper-badge ${k.isMain ? "keeper-main" : "keeper-vice"}`}>
            {k.staffName}
            <em>{k.isMain ? (keeperColCfg?.mainLabel || "Chính") : (keeperColCfg?.viceLabel || "Phó")}</em>
          </span>
        ))}
      </div>
    );
  };

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
            <button className="btn btn-sm btn-outline" onClick={exportExcel} disabled={exporting}>
              {exporting ? '⏳ Đang xuất...' : '📊 Xuất Excel'}
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

        {/* --- FILTER BAR --- */}
        {filterFields.length > 0 && (
          <div className="filter-bar">
            {filterFields.map((f) => (
              <label key={f.key} className="filter-field">
                <span className="filter-label">{f.label}</span>
                {f.type === "entity_select" ? (
                  <EntitySelect
                    lookupEntity={f.lookupEntity}
                    lookupLabelField={f.lookupLabelField}
                    value={backendFilters[f.key] ?? ""}
                    onChange={(val) => handleFilterChange(f, val)}
                    credential={credential}
                  />
                ) : f.type === "enum_filter" ? (
                  <EnumFilterSelect
                    enumType={f.enumType}
                    value={clientFilters[f.key] ?? ""}
                    onChange={(val) => handleFilterChange(f, val)}
                    credential={credential}
                  />
                ) : (
                  <input
                    type="text"
                    value={clientFilters[f.key] ?? ""}
                    onChange={(e) => handleFilterChange(f, e.target.value)}
                    placeholder={f.label}
                    className="filter-input"
                  />
                )}
              </label>
            ))}
            {hasActiveFilters && (
              <button
                className="btn btn-sm btn-secondary filter-clear-btn"
                onClick={clearFilters}
              >
                ✕ Xóa lọc
              </button>
            )}
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
            {/* Read-only keeper panel shown when a keeper column exists */}
            {keeperColCfg && (
              <div className="keeper-detail-panel">
                <div className="keeper-detail-title">{keeperColCfg.columnLabel}</div>
                {(() => {
                  const keepers = keepersByRowId[String(editingRow.id)];
                  if (!keepers || keepers.length === 0)
                    return <span className="text-muted keeper-detail-empty">Chưa có thủ kho được phân công</span>;
                  return (
                    <div className="keeper-detail-list">
                      {keepers.map((k, i) => (
                        <div key={i} className="keeper-detail-item">
                          <span className={`keeper-badge ${k.isMain ? "keeper-main" : "keeper-vice"}`}>
                            {k.isMain ? (keeperColCfg.mainLabel || "Chính") : (keeperColCfg.viceLabel || "Phó")}
                          </span>
                          <span className="keeper-detail-name">{k.staffName}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}
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
            onClose={() => { setShowM2mModal(false); loadRows(); }}
          />
        )}

        {/* --- DATA TABLE --- */}
        {loading ? (
          <div className="loading-bar">Đang tải dữ liệu...</div>
        ) : displayedRows.length === 0 ? (
          <div className="empty-state">
            {rows.length > 0 ? "Không có kết quả phù hợp" : "Chưa có dữ liệu"}
          </div>
        ) : (
          <div className="panel-body-flush">
            {rows.length !== displayedRows.length && (
              <div className="filter-result-count">
                Hiển thị {displayedRows.length} / {rows.length} bản ghi
              </div>
            )}
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    {columns.map((c) => (
                      <th key={c}>{getColHeader(c)}</th>
                    ))}
                    {canEdit && <th>Thao tác</th>}
                  </tr>
                </thead>
                <tbody>
                  {displayedRows.map((row) => {
                    const nameCol = ENTITY_SCHEMAS[entity]?.[0]?.key;
                    return (
                      <tr
                        key={row.id ?? JSON.stringify(row)}
                        className={
                          editingRow?.id === row.id ? "row-editing" : ""
                        }
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
                                {getCellDisplay(c, row[c])}
                              </button>
                            ) : KEEPER_COLUMN_CONFIG[c] ? (
                              renderKeeperCell(row.id)
                            ) : (
                              getCellDisplay(c, row[c])
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
