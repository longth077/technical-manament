import { useState } from 'react';
import { ENTITY_SCHEMAS, buildDefaultRow } from '../services/entitySchema';

/**
 * A form for creating / editing entity rows.
 * Offers two modes:
 *   1. "table" – labelled inputs in a grid (default)
 *   2. "json"  – raw JSON textarea (fallback / advanced)
 *
 * Props:
 *   entity      – entity key (e.g. 'staff')
 *   initialData – object with pre-filled values (for editing); omit for new rows
 *   onSubmit    – (payload: object) => void
 *   onCancel    – () => void
 *   submitLabel – text on the submit button
 */
export default function TableForm({ entity, initialData, onSubmit, onCancel, submitLabel = 'Lưu' }) {
  const schema = ENTITY_SCHEMAS[entity];
  const defaultFields = buildDefaultRow(entity);

  // Mode: 'table' or 'json'
  const [mode, setMode] = useState('table');

  // Table-mode state: field values keyed by column key
  const [fields, setFields] = useState(() => {
    if (initialData) {
      // Merge initial data (skip id / auto fields)
      const merged = { ...defaultFields };
      for (const col of schema || []) {
        if (initialData[col.key] !== undefined && initialData[col.key] !== null) {
          merged[col.key] = String(initialData[col.key]);
        }
      }
      return merged;
    }
    return defaultFields;
  });

  // JSON-mode state
  const [jsonText, setJsonText] = useState(() => {
    if (initialData) {
      const copy = { ...initialData };
      delete copy.id;
      delete copy.created_at;
      delete copy.updated_at;
      delete copy.uploaded_at;
      return JSON.stringify(copy, null, 2);
    }
    return '{}';
  });

  const [error, setError] = useState('');

  const resetForm = () => {
    setError('');
    setMode('table');
    setFields(() => {
      if (!initialData) return buildDefaultRow(entity);
      const merged = { ...buildDefaultRow(entity) };
      for (const col of schema || []) {
        if (initialData[col.key] !== undefined && initialData[col.key] !== null) {
          merged[col.key] = String(initialData[col.key]);
        }
      }
      return merged;
    });
    if (initialData) {
      const copy = { ...initialData };
      delete copy.id;
      delete copy.created_at;
      delete copy.updated_at;
      delete copy.uploaded_at;
      setJsonText(JSON.stringify(copy, null, 2));
    } else {
      setJsonText('{}');
    }
  };

  const handleCancel = () => {
    resetForm();
    onCancel?.();
  };

  const setField = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    setError('');
    try {
      let payload;
      if (mode === 'json') {
        payload = JSON.parse(jsonText);
      } else {
        payload = {};
        for (const col of schema || []) {
          const raw = fields[col.key];
          if (col.type === 'number' && raw !== '' && raw !== undefined) {
            const num = Number(raw);
            if (Number.isNaN(num)) {
              setError(`"${col.label}" phải là số hợp lệ`);
              return;
            }
            payload[col.key] = num;
          } else {
            payload[col.key] = raw ?? '';
          }
        }
      }
      delete payload.id;
      delete payload.created_at;
      delete payload.updated_at;
      delete payload.uploaded_at;
      onSubmit(payload);
    } catch (e) {
      setError(e.message);
    }
  };

  // When switching modes, sync data between them
  const switchMode = (newMode) => {
    if (newMode === mode) return;
    if (newMode === 'json') {
      // Table → JSON: serialize current fields
      const obj = {};
      for (const col of schema || []) {
        const raw = fields[col.key];
        if (col.type === 'number' && raw !== '' && raw !== undefined) {
          const n = Number(raw);
          obj[col.key] = Number.isNaN(n) ? raw : n;
        } else {
          obj[col.key] = raw ?? '';
        }
      }
      setJsonText(JSON.stringify(obj, null, 2));
    } else {
      // JSON → Table: parse JSON into fields
      try {
        const obj = JSON.parse(jsonText);
        const next = { ...buildDefaultRow(entity) };
        for (const col of schema || []) {
          if (obj[col.key] !== undefined && obj[col.key] !== null) {
            next[col.key] = String(obj[col.key]);
          }
        }
        setFields(next);
      } catch {
        // If JSON is invalid, just switch mode without syncing
      }
    }
    setMode(newMode);
  };

  // Fallback: no schema defined for this entity → force JSON mode
  if (!schema) {
    return (
      <div className="table-form">
        <div className="table-form-header">
          <span className="table-form-title">Nhập dữ liệu JSON</span>
        </div>
        <textarea
          className="form-textarea"
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          rows={8}
        />
        {error && <div className="error-msg">{error}</div>}
        <div className="table-form-actions">
          <button className="btn btn-sm btn-success" onClick={handleSubmit}>{submitLabel}</button>
          {onCancel && <button className="btn btn-sm btn-secondary" onClick={handleCancel}>Hủy</button>}
        </div>
      </div>
    );
  }

  return (
    <div className="table-form">
      {/* Mode toggle */}
      <div className="table-form-header">
        <div className="mode-toggle">
          <button
            className={`mode-toggle-btn ${mode === 'table' ? 'active' : ''}`}
            onClick={() => switchMode('table')}
            type="button"
          >
            📝 Biểu mẫu
          </button>
          <button
            className={`mode-toggle-btn ${mode === 'json' ? 'active' : ''}`}
            onClick={() => switchMode('json')}
            type="button"
          >
            {'{ } JSON'}
          </button>
        </div>
      </div>

      {mode === 'table' ? (
        <div className="form-grid">
          {schema.map((col) => (
            <div className="form-field" key={col.key}>
              <label className="form-label">{col.label}</label>
              {col.type === 'select' ? (
                <select
                  className="form-select"
                  value={fields[col.key] ?? ''}
                  onChange={(e) => setField(col.key, e.target.value)}
                >
                  {col.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : col.type === 'textarea' ? (
                <textarea
                  className="form-textarea"
                  value={fields[col.key] ?? ''}
                  onChange={(e) => setField(col.key, e.target.value)}
                  rows={3}
                  placeholder={col.placeholder || ''}
                />
              ) : (
                <input
                  className="form-input"
                  type={col.type === 'number' ? 'number' : col.type === 'date' ? 'date' : 'text'}
                  value={fields[col.key] ?? ''}
                  onChange={(e) => setField(col.key, e.target.value)}
                  placeholder={col.placeholder || ''}
                  step={col.type === 'number' ? 'any' : undefined}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <textarea
          className="form-textarea"
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          rows={Math.max(8, (schema.length * 1.2) | 0)}
        />
      )}

      {error && <div className="error-msg" style={{ marginTop: '0.5rem' }}>{error}</div>}

      <div className="table-form-actions">
        <button className="btn btn-sm btn-success" onClick={handleSubmit}>{submitLabel}</button>
        {onCancel && <button className="btn btn-sm btn-secondary" onClick={handleCancel}>Hủy</button>}
      </div>
    </div>
  );
}
