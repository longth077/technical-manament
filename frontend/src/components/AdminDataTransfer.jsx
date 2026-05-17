import { useRef, useState } from "react";
import { Api } from "../services/api";

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminDataTransfer({ credential }) {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importingCsv, setImportingCsv] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [exportingSql, setExportingSql] = useState(false);
  const [exportingCsv, setExportingCsv] = useState(false);
  const fileInputRef = useRef(null);
  const csvFileInputRef = useRef(null);

  const notify = (msg, error = false) => {
    setMessage(msg);
    setIsError(error);
  };

  const exportExcel = async () => {
    if (exportingExcel) return;
    setExportingExcel(true);
    notify("");
    try {
      const blob = await Api.exportAllExcel(credential);
      const now = new Date();
      const dateTag = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
      downloadBlob(blob, `sao-luu-du-lieu-${dateTag}.xlsx`);
      notify("Xuất file Excel thành công");
    } catch (e) {
      notify(e.message, true);
    } finally {
      setExportingExcel(false);
    }
  };

  const exportSql = async () => {
    if (exportingSql) return;
    setExportingSql(true);
    notify("");
    try {
      const blob = await Api.exportAllSql(credential);
      const now = new Date();
      const dateTag = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
      downloadBlob(blob, `sao-luu-du-lieu-${dateTag}.sql`);
      notify("Xuất file SQL thành công");
    } catch (e) {
      notify(e.message, true);
    } finally {
      setExportingSql(false);
    }
  };

  const exportCsv = async () => {
    if (exportingCsv) return;
    setExportingCsv(true);
    notify("");
    try {
      const blob = await Api.exportAllCsv(credential);
      const now = new Date();
      const dateTag = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
      downloadBlob(blob, `sao-luu-du-lieu-${dateTag}-csv.zip`);
      notify("Xuất file CSV thành công");
    } catch (e) {
      notify(e.message, true);
    } finally {
      setExportingCsv(false);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      notify("Vui lòng chọn file Excel (.xlsx hoặc .xls)", true);
      return;
    }

    setImporting(true);
    notify("");
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      await Api.importExcel(base64, credential);
      notify("Nhập dữ liệu Excel thành công");
    } catch (e) {
      notify(e.message, true);
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCsvFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".zip")) {
      notify("Vui lòng chọn file ZIP chứa các file CSV (.zip)", true);
      return;
    }

    setImportingCsv(true);
    notify("");
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      await Api.importCsv(base64, credential);
      notify("Nhập dữ liệu CSV thành công");
    } catch (e) {
      notify(e.message, true);
    } finally {
      setImportingCsv(false);
      if (csvFileInputRef.current) csvFileInputRef.current.value = "";
    }
  };

  const anyExporting = exportingExcel || exportingSql || exportingCsv;

  return (
    <section className="admin-section">
      <div className="panel">
        <div className="panel-header">
          <h3>📦 Nhập / Xuất dữ liệu</h3>
        </div>
        <div className="panel-body">
          {message && (
            <div
              className={isError ? "error-msg" : "status-msg"}
              style={{ marginBottom: "1rem" }}
            >
              {message}
            </div>
          )}

          <div className="transfer-grid">
            {/* Export */}
            <div className="transfer-card">
              <h4>📤 Xuất dữ liệu sao lưu</h4>
              <p>
                Tải toàn bộ dữ liệu hệ thống ra file để sao lưu hoặc chuyển đổi.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                  marginTop: "0.5rem",
                }}
              >
                <button
                  className="btn btn-success"
                  onClick={exportExcel}
                  disabled={anyExporting}
                >
                  {exportingExcel ? "⏳ Đang xuất..." : "📊 Xuất Excel (.xlsx)"}
                </button>
                <button
                  className="btn btn-outline"
                  onClick={exportSql}
                  disabled={anyExporting}
                >
                  {exportingSql ? "⏳ Đang xuất..." : "🗄️ Xuất SQL (.sql)"}
                </button>
                <button
                  className="btn btn-outline"
                  onClick={exportCsv}
                  disabled={anyExporting}
                >
                  {exportingCsv ? "⏳ Đang xuất..." : "📄 Xuất CSV (.zip)"}
                </button>
              </div>
              <p
                style={{
                  marginTop: "0.5rem",
                  fontSize: "0.85rem",
                  color: "#666",
                }}
              >
                Excel: phù hợp để xem và chia sẻ dữ liệu.
                <br />
                SQL: phù hợp để khôi phục toàn bộ cơ sở dữ liệu.
                <br />
                CSV: file nén ZIP chứa từng bảng dữ liệu dạng CSV.
              </p>
            </div>

            {/* Import Excel */}
            <div className="transfer-card">
              <h4>📥 Nhập dữ liệu Excel</h4>
              <p>
                Chọn file Excel (.xlsx) đã được xuất từ hệ thống để nhập lại dữ
                liệu.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="file-input"
                onChange={handleFileSelect}
                disabled={importing}
              />
              {importing && (
                <div className="loading-bar" style={{ padding: "0.5rem 0" }}>
                  Đang nhập dữ liệu...
                </div>
              )}
            </div>

            {/* Import CSV */}
            <div className="transfer-card">
              <h4>📥 Nhập dữ liệu CSV</h4>
              <p>
                Chọn file ZIP chứa các file CSV (.zip) đã được xuất từ hệ thống
                để nhập lại dữ liệu.
              </p>
              <input
                ref={csvFileInputRef}
                type="file"
                accept=".zip"
                className="file-input"
                onChange={handleCsvFileSelect}
                disabled={importingCsv}
              />
              {importingCsv && (
                <div className="loading-bar" style={{ padding: "0.5rem 0" }}>
                  Đang nhập dữ liệu...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
