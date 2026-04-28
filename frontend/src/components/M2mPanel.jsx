import { useEffect, useState } from "react";
import { Api } from "../services/api";

export default function M2mPanel({
  staffId,
  junctionEntity,
  filterField,
  targetEntity,
  targetIdField,
  targetLabelField,
  label,
  credential,
  canEdit,
}) {
  const [assignments, setAssignments] = useState([]);
  const [available, setAvailable] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAssignments = () => {
    if (!staffId) return;
    Api.listEntity(junctionEntity, credential, { [filterField]: staffId })
      .then((data) => setAssignments(data.rows || []))
      .catch((e) => setError(e.message));
  };

  useEffect(() => {
    if (!staffId) return;
    let active = true;
    setLoading(true);
    Promise.all([
      Api.listEntity(junctionEntity, credential, { [filterField]: staffId }),
      Api.listEntity(targetEntity, credential),
    ])
      .then(([jData, tData]) => {
        if (!active) return;
        setAssignments(jData.rows || []);
        const items = tData.rows || [];
        setAvailable(items);
        if (items.length > 0) setSelectedId(String(items[0].id));
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
  }, [staffId, junctionEntity, targetEntity, credential]);

  const getLabel = (row) => {
    const targetId = row[targetIdField];
    const item = available.find((i) => String(i.id) === String(targetId));
    if (item) return item[targetLabelField] || `ID: ${targetId}`;
    const nameField = targetIdField.replace("_id", "_name");
    return row[nameField] || `ID: ${targetId ?? "?"}`;
  };

  const handleAdd = async () => {
    if (!selectedId) return;
    try {
      await Api.createEntity(
        junctionEntity,
        { [filterField]: Number(staffId), [targetIdField]: Number(selectedId) },
        credential,
      );
      setError("");
      loadAssignments();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleRemove = async (id) => {
    try {
      await Api.deleteEntity(junctionEntity, id, credential);
      setError("");
      loadAssignments();
    } catch (e) {
      setError(e.message);
    }
  };

  if (!staffId) return null;

  return (
    <div className="m2m-panel">
      <div className="m2m-panel-title">{label}</div>
      {loading ? (
        <div className="loading-bar">Đang tải...</div>
      ) : (
        <>
          {assignments.length === 0 ? (
            <div className="m2m-empty">Chưa có phân công</div>
          ) : (
            <ul className="m2m-list">
              {assignments.map((row) => (
                <li key={row.id} className="m2m-item">
                  <span>{getLabel(row)}</span>
                  {canEdit && (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemove(row.id)}
                    >
                      ✕
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          {canEdit && available.length > 0 && (
            <div className="m2m-add">
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="form-select m2m-select"
              >
                <option value="">-- Chọn --</option>
                {available.map((item) => (
                  <option key={item.id} value={String(item.id)}>
                    {item[targetLabelField] || `ID: ${item.id}`}
                  </option>
                ))}
              </select>
              <button
                className="btn btn-sm btn-primary"
                onClick={handleAdd}
                disabled={!selectedId}
              >
                + Thêm
              </button>
            </div>
          )}
          {error && <div className="error-msg">{error}</div>}
        </>
      )}
    </div>
  );
}
