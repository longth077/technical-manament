import { useRef } from 'react';
import { downloadFile, uploadFile } from '../services/api';

export default function ExcelButtons({ exportUrl, importUrl, onImportSuccess, onError }) {
  const fileInput = useRef(null);

  const handleExport = async () => {
    const { error } = await downloadFile(exportUrl);
    if (error && onError) onError(error);
  };

  const handleImportClick = () => {
    fileInput.current.value = '';
    fileInput.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { data, error } = await uploadFile(importUrl, file);
    if (error) {
      if (onError) onError(error);
    } else {
      if (onImportSuccess) onImportSuccess(data?.message || `Đã nhập ${data?.count || 0} bản ghi`);
    }
  };

  return (
    <div className="excel-buttons">
      <button className="btn btn-excel btn-sm" onClick={handleExport} title="Xuất Excel">
        ⬇ Xuất Excel
      </button>
      <button className="btn btn-excel-import btn-sm" onClick={handleImportClick} title="Nhập Excel">
        ⬆ Nhập Excel
      </button>
      <input
        ref={fileInput}
        type="file"
        accept=".xlsx,.xls"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
}
