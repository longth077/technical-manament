import { useEffect, useState } from "react";
import { Api } from "../services/api";
import { ENTITY_SCHEMAS } from "../services/entitySchema";

/**
 * Card-based overview page showing unit_infos and overviews as info panels
 * instead of tables. Supports inline editing per panel.
 */
export default function UnitOverviewPage({ credential, canEdit }) {
  return (
    <div className="overview-page">
      <OverviewCard
        entity="unit_infos"
        title="Thông tin đơn vị"
        credential={credential}
        canEdit={canEdit}
      />
      <OverviewCard
        entity="overviews"
        title="Tổng quan mặt bằng"
        credential={credential}
        canEdit={canEdit}
      />
    </div>
  );
}

function OverviewCard({ entity, title, credential, canEdit }) {
  const schema = ENTITY_SCHEMAS[entity] || [];
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({});
  const [saving, setSaving] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Reset during render when entity or credential changes (avoids setState-in-effect)
  const [prevKey, setPrevKey] = useState(`${entity}::${credential}`);
  const currentKey = `${entity}::${credential}`;
  if (prevKey !== currentKey) {
    setPrevKey(currentKey);
    setLoading(true);
    setError("");
    setData(null);
    setIsEditing(false);
  }

  useEffect(() => {
    let active = true;
    Api.listEntity(entity, credential)
      .then((res) => {
        if (!active) return;
        const row = (res.rows || [])[0] ?? null;
        setData(row);
        setDraft(row ? { ...row } : {});
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
  }, [entity, credential, reloadKey]);

  const reload = () => {
    setLoading(true); // OK: called from event handler, not in effect body
    setError("");
    setReloadKey((k) => k + 1);
  };

  const startEdit = () => {
    setDraft(data ? { ...data } : {});
    setIsEditing(true);
    setError("");
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setError("");
    setDraft(data ? { ...data } : {});
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = {};
      for (const f of schema) payload[f.key] = draft[f.key] ?? "";
      if (data?.id) {
        await Api.updateEntity(entity, data.id, payload, credential);
      } else {
        await Api.createEntity(entity, payload, credential);
      }
      setIsEditing(false);
      reload();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="overview-card">
      <div className="overview-card-header">
        <h3>{title}</h3>
        {canEdit && !isEditing && (
          <button className="btn btn-sm btn-outline" onClick={startEdit}>
            ✏️ Chỉnh sửa
          </button>
        )}
        {isEditing && (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              className="btn btn-sm btn-primary"
              onClick={save}
              disabled={saving}
            >
              {saving ? "Đang lưu..." : "💾 Lưu"}
            </button>
            <button
              className="btn btn-sm btn-secondary"
              onClick={cancelEdit}
              disabled={saving}
            >
              ✕ Hủy
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="error-msg" style={{ margin: "0.5rem 1.25rem" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading-bar">Đang tải...</div>
      ) : (
        <div className="overview-card-body">
          {schema.map((field) => (
            <div key={field.key} className="overview-field">
              <span className="overview-field-label">{field.label}</span>
              {isEditing ? (
                field.type === "textarea" ? (
                  <textarea
                    className="overview-field-input"
                    value={draft[field.key] ?? ""}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                ) : (
                  <input
                    className="overview-field-input"
                    type={field.type === "date" ? "date" : "text"}
                    value={draft[field.key] ?? ""}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                  />
                )
              ) : (
                <span className="overview-field-value">
                  {data?.[field.key] ?? "—"}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
