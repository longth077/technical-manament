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

export default function EntitySection({ entity, credential, canEdit }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState('{}');

  const loadRows = async () => {
    try {
      const data = await Api.listEntity(entity, credential);
      setRows(data.rows || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    Api.listEntity(entity, credential)
      .then((data) => {
        if (active) setRows(data.rows || []);
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
  }, [entity, credential]);

  const createRow = async () => {
    try {
      const payload = JSON.parse(draft);
      await Api.createEntity(entity, payload, credential);
      setDraft('{}');
      await loadRows();
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
      await loadRows();
    } catch (e) {
      setError(e.message);
    }
  };

  const deleteRow = async (id) => {
    if (!confirm('Delete row?')) return;
    try {
      await Api.deleteEntity(entity, id, credential);
      await loadRows();
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
    <section>
      <h3>{entity}</h3>
      <button onClick={exportExcel}>Export report (Excel)</button>
      <button onClick={loadRows} style={{ marginLeft: 8 }}>Refresh</button>
      {error && <p className="error">{error}</p>}
      {canEdit && (
        <div className="json-box">
          <p>Create row (JSON):</p>
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={6} />
          <button onClick={createRow}>Create</button>
        </div>
      )}
      {loading ? <p>Loading...</p> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {columns.map((c) => <th key={c}>{c}</th>)}
                {canEdit && <th>actions</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id ?? JSON.stringify(row)}>
                  {columns.map((c) => <td key={c}>{String(row[c] ?? '')}</td>)}
                  {canEdit && (
                    <td>
                      <button onClick={() => updateRow(row)}>Edit</button>
                      <button onClick={() => deleteRow(row.id)} style={{ marginLeft: 8 }}>Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
