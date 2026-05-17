import { useEffect, useState, useCallback, useRef } from "react";
import { Api } from "../services/api";
import { ENTITY_SCHEMAS } from "../services/entitySchema";

/** Renders full key-value detail card for a target entity item */
function EntityDetailCard({ item, schema }) {
  if (!item) return <div className="m2m-empty">Không có thông tin</div>;
  return (
    <table className="assign-detail-table">
      <tbody>
        {schema
          .filter((col) => item[col.key] !== undefined)
          .map((col) => (
            <tr key={col.key}>
              <td className="assign-detail-label">{col.label}</td>
              <td className="assign-detail-value">
                {String(item[col.key] ?? "")}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}

/** Tab content for one M2M relationship category */
function AssignTab({ config, staffId, credential, canEdit }) {
  const {
    junctionEntity,
    filterField,
    targetEntity,
    targetIdField,
    targetLabelField,
    primaryEntity,
    primaryLabelField,
    coAssigneeTitle,
    label,
    isMainField,
    mainLabel,
    viceLabel,
  } = config;

  const [available, setAvailable] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [allPrimaries, setAllPrimaries] = useState({});
  const [selectedId, setSelectedId] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [coAssignees, setCoAssignees] = useState({});
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [settingMainId, setSettingMainId] = useState(null);
  const [error, setError] = useState("");

  const targetSchema = ENTITY_SCHEMAS[targetEntity] || [];
  const loadedTargetIds = useRef(new Set());

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      Api.listEntity(targetEntity, credential),
      Api.listEntity(junctionEntity, credential, { [filterField]: staffId }),
      Api.listEntity(primaryEntity, credential),
    ])
      .then(([tData, jData, pData]) => {
        setAvailable(tData.rows || []);
        setAssignments(jData.rows || []);
        const map = {};
        for (const s of pData.rows || []) {
          map[String(s.id)] = s;
        }
        setAllPrimaries(map);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [
    targetEntity,
    junctionEntity,
    filterField,
    staffId,
    primaryEntity,
    credential,
  ]);

  useEffect(() => {
    load();
  }, [load]);

  const loadCoAssignees = useCallback(
    async (targetId) => {
      const key = String(targetId);
      if (loadedTargetIds.current.has(key)) return;
      loadedTargetIds.current.add(key);
      try {
        const data = await Api.listEntity(junctionEntity, credential, {
          [targetIdField]: targetId,
        });
        setCoAssignees((prev) => ({ ...prev, [key]: data.rows || [] }));
      } catch {
        loadedTargetIds.current.delete(key);
      }
    },
    [junctionEntity, targetIdField, credential],
  );

  const getTargetItem = (row) => {
    const tid = row[targetIdField];
    return available.find((i) => String(i.id) === String(tid)) || null;
  };

  const invalidateCoCache = (targetId) => {
    const key = String(targetId);
    loadedTargetIds.current.delete(key);
    setCoAssignees((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleAssign = async () => {
    if (!selectedId) return;
    setAdding(true);
    setError("");
    try {
      await Api.createEntity(
        junctionEntity,
        {
          [filterField]: Number(staffId),
          [targetIdField]: Number(selectedId),
        },
        credential,
      );
      setSelectedId("");
      invalidateCoCache(selectedId);
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (id, targetId) => {
    try {
      await Api.deleteEntity(junctionEntity, id, credential);
      setError("");
      invalidateCoCache(targetId);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleSetMain = async (rowId, targetId) => {
    setSettingMainId(rowId);
    setError("");
    try {
      await Api.updateEntity(
        junctionEntity,
        rowId,
        { [isMainField]: 1 },
        credential,
      );
      invalidateCoCache(targetId);
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSettingMainId(null);
    }
  };

  const toggleExpand = (row) => {
    const rid = row.id;
    const targetId = row[targetIdField];
    if (expandedId === rid) {
      setExpandedId(null);
    } else {
      setExpandedId(rid);
      loadCoAssignees(targetId);
    }
  };

  if (loading) return <div className="loading-bar">Đang tải...</div>;

  const assignedTargetIds = new Set(
    assignments.map((a) => String(a[targetIdField])),
  );
  const unassigned = available.filter(
    (i) => !assignedTargetIds.has(String(i.id)),
  );

  return (
    <div className="assign-tab-body">
      {canEdit && (
        <div className="assign-add-row">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="form-select"
          >
            <option value="">
              -- Chọn {label.toLowerCase()} để phân công --
            </option>
            {unassigned.map((item) => (
              <option key={item.id} value={String(item.id)}>
                {item[targetLabelField] || `ID: ${item.id}`}
              </option>
            ))}
          </select>
          <button
            className="btn btn-sm btn-primary"
            onClick={handleAssign}
            disabled={!selectedId || adding}
          >
            {adding ? "..." : "+ Phân công"}
          </button>
        </div>
      )}
      {error && <div className="error-msg">{error}</div>}

      {assignments.length === 0 ? (
        <div className="m2m-empty">Chưa có phân công nào</div>
      ) : (
        <ul className="assign-list">
          {assignments.map((row) => {
            const item = getTargetItem(row);
            const isExpanded = expandedId === row.id;
            const targetId = row[targetIdField];
            const coKey = String(targetId);
            const coList = coAssignees[coKey];
            return (
              <li key={row.id} className="assign-item">
                <div className="assign-item-header">
                  <div className="assign-item-name-group">
                    <span className="assign-item-name">
                      {item
                        ? item[targetLabelField] || `ID: ${item.id}`
                        : `ID: ${targetId ?? "?"}`}
                    </span>
                    {isMainField && (
                      <span
                        className={`keeper-badge ${row[isMainField] ? "keeper-main" : "keeper-vice"}`}
                      >
                        {row[isMainField]
                          ? mainLabel || "Chính"
                          : viceLabel || "Phó"}
                      </span>
                    )}
                  </div>
                  <div className="assign-item-actions">
                    {canEdit && isMainField && !row[isMainField] && (
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleSetMain(row.id, targetId)}
                        disabled={settingMainId === row.id}
                      >
                        {settingMainId === row.id ? "..." : "★ Đặt làm chính"}
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => toggleExpand(row)}
                    >
                      {isExpanded ? "▲ Ẩn" : "▼ Chi tiết"}
                    </button>
                    {canEdit && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleRemove(row.id, targetId)}
                      >
                        ✕ Bỏ
                      </button>
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="assign-item-detail">
                    <div className="assign-detail-section">
                      <div className="assign-detail-title">
                        Thông tin {label}
                      </div>
                      <EntityDetailCard item={item} schema={targetSchema} />
                    </div>

                    <div className="assign-detail-section">
                      <div className="assign-detail-title">Ngày phân công</div>
                      <div className="assign-detail-value">
                        {row.assigned_at || "—"}
                      </div>
                    </div>

                    <div className="assign-detail-section">
                      <div className="assign-detail-title">
                        {coAssigneeTitle ||
                          `Cán bộ phụ trách ${label.toLowerCase()} này`}
                      </div>
                      {!coList ? (
                        <div className="m2m-empty">Đang tải...</div>
                      ) : coList.length === 0 ? (
                        <div className="m2m-empty">Không có</div>
                      ) : (
                        <ul className="co-assign-list">
                          {coList.map((ca) => {
                            const pItem = allPrimaries[String(ca[filterField])];
                            const isMe =
                              String(ca[filterField]) === String(staffId);
                            return (
                              <li
                                key={ca.id}
                                className={`co-assign-item${isMe ? " co-assign-me" : ""}`}
                              >
                                <span>
                                  {pItem
                                    ? pItem[primaryLabelField] ||
                                      `ID: ${ca[filterField]}`
                                    : `ID: ${ca[filterField]}`}
                                </span>
                                {isMe && (
                                  <span className="co-assign-badge">
                                    (mục này)
                                  </span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/**
 * Single unified assignment modal for all M2M relationships of a staff member.
 * Tabs: one per M2M config entry (Kho | Vũ khí | Phương tiện | Thiết bị).
 * Each tab shows full entity info, assignment date, and all co-assignees.
 */
export default function StaffAssignModal({
  staffId,
  configs,
  credential,
  canEdit,
  entityLabel,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState(0);

  if (!staffId || !configs?.length) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-box modal-box-lg">
        <div className="modal-header">
          <span className="modal-title">
            Phân công — {entityLabel || "Mục"} #{staffId}
          </span>
          <button className="btn btn-sm modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="assign-tabs">
          {configs.map((cfg, i) => (
            <button
              key={cfg.junctionEntity}
              className={`assign-tab-btn${activeTab === i ? " active" : ""}`}
              onClick={() => setActiveTab(i)}
            >
              {cfg.label}
            </button>
          ))}
        </div>
        <div className="modal-body">
          {configs.map((cfg, i) =>
            activeTab === i ? (
              <AssignTab
                key={cfg.junctionEntity}
                config={cfg}
                staffId={staffId}
                credential={credential}
                canEdit={canEdit}
              />
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
}
