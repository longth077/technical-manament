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
      setMessage('SQL export completed');
    } catch (e) {
      setMessage(e.message);
    }
  };

  const exportExcel = async () => {
    try {
      const blob = await Api.exportAllExcel(credential);
      downloadBlob(blob, 'technical-management.xlsx');
      setMessage('Excel export completed');
    } catch (e) {
      setMessage(e.message);
    }
  };

  const importSql = async () => {
    try {
      await Api.importSql(sqlInput, credential);
      setMessage('SQL imported');
    } catch (e) {
      setMessage(e.message);
    }
  };

  const importExcel = async () => {
    try {
      await Api.importExcel(excelBase64, credential);
      setMessage('Excel imported');
    } catch (e) {
      setMessage(e.message);
    }
  };

  return (
    <section>
      <h3>Admin import/export</h3>
      <p>{message}</p>
      <button onClick={exportSql}>Export all SQL</button>
      <button onClick={exportExcel} style={{ marginLeft: 8 }}>Export all Excel</button>

      <p>Import SQL</p>
      <textarea rows={8} value={sqlInput} onChange={(e) => setSqlInput(e.target.value)} />
      <button onClick={importSql}>Import SQL</button>

      <p>Import Excel (base64)</p>
      <textarea rows={6} value={excelBase64} onChange={(e) => setExcelBase64(e.target.value)} />
      <button onClick={importExcel}>Import Excel</button>
    </section>
  );
}
