import { useState } from "react";
import { Api } from "../services/api";

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function dateSuffix() {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
}

// All entities that have a formatted report (mirrors backend ENTITY_COLUMNS keys)
const REPORT_ENTITIES = [
  { key: "unit_infos", label: "Thông tin đơn vị", icon: "🏢" },
  { key: "overviews", label: "Tổng quan khu kỹ thuật", icon: "🗺️" },
  { key: "staffs", label: "Danh sách cán bộ", icon: "👤" },
  { key: "warehouses", label: "Kho trạm xưởng", icon: "🏭" },
  { key: "warehouse_images", label: "Ảnh kho", icon: "🖼️" },
  { key: "warehouse_equipments", label: "Trang bị vật tư kho", icon: "🔧" },
  { key: "warehouse_inspections", label: "Kiểm tra kho", icon: "🔍" },
  { key: "warehouse_accesses", label: "Đăng ký ra vào kho", icon: "🚪" },
  { key: "warehouse_handovers", label: "Giao nhận tạm thời", icon: "🤝" },
  { key: "warehouse_exports", label: "Xuất kho", icon: "📤" },
  { key: "warehouse_imports", label: "Nhập kho", icon: "📥" },
  { key: "warehouse_lightnings", label: "Kiểm tra chống sét", icon: "⚡" },
  { key: "weapons", label: "Vũ khí trang bị", icon: "⚔️" },
  { key: "tech_equipments", label: "Trang thiết bị kỹ thuật", icon: "💻" },
  { key: "vehicles", label: "Phương tiện", icon: "🚗" },
  { key: "materials", label: "Vật tư", icon: "📦" },
  { key: "staff_warehouses", label: "Phân công thủ kho", icon: "🗝️" },
  { key: "staff_weapons", label: "Phân công vũ khí", icon: "🔫" },
  { key: "staff_vehicles", label: "Phân công phương tiện", icon: "🚙" },
  { key: "staff_tech_equipment", label: "Phân công thiết bị KT", icon: "🖥️" },
];

export default function AdminReports({ credential }) {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [exportingAll, setExportingAll] = useState(false);
  // Track individual entity export state: { [key]: true/false }
  const [exportingMap, setExportingMap] = useState({});

  const notify = (msg, error = false) => {
    setMessage(msg);
    setIsError(error);
  };

  const exportAll = async () => {
    if (exportingAll) return;
    setExportingAll(true);
    notify("");
    try {
      const blob = await Api.exportAllReports(credential);
      downloadBlob(blob, `bao-cao-toan-he-thong-${dateSuffix()}.xlsx`);
      notify("Xuất tất cả báo cáo thành công");
    } catch (e) {
      notify(e.message, true);
    } finally {
      setExportingAll(false);
    }
  };

  const exportOne = async (entity) => {
    if (exportingMap[entity.key]) return;
    setExportingMap((prev) => ({ ...prev, [entity.key]: true }));
    notify("");
    try {
      const blob = await Api.exportEntityExcel(entity.key, credential);
      downloadBlob(blob, `bao-cao-${entity.key}-${dateSuffix()}.xlsx`);
      notify(`Xuất báo cáo "${entity.label}" thành công`);
    } catch (e) {
      notify(e.message, true);
    } finally {
      setExportingMap((prev) => ({ ...prev, [entity.key]: false }));
    }
  };

  const anyBusy = exportingAll || Object.values(exportingMap).some(Boolean);

  return (
    <section className="admin-section">
      <div className="panel">
        <div className="panel-header">
          <h3>📊 Báo cáo Excel</h3>
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

          {/* All-in-one export */}
          <div className="transfer-card" style={{ marginBottom: "1.5rem" }}>
            <h4>📋 Xuất tất cả báo cáo</h4>
            <p>
              Tạo một file Excel gồm tất cả các bảng dữ liệu, hiển thị theo định
              dạng nghiệp vụ với nhãn tiếng Việt, tra cứu FK và phân loại enum.
            </p>
            <button
              className="btn btn-success"
              onClick={exportAll}
              disabled={anyBusy}
              style={{ marginTop: "0.5rem" }}
            >
              {exportingAll
                ? "⏳ Đang xuất..."
                : "📥 Tải tất cả báo cáo (.xlsx)"}
            </button>
          </div>

          {/* Per-entity cards */}
          <div
            style={{
              marginBottom: "0.75rem",
              fontWeight: 600,
              color: "#374151",
            }}
          >
            Hoặc xuất từng bảng:
          </div>
          <div className="reports-grid">
            {REPORT_ENTITIES.map((entity) => (
              <div key={entity.key} className="report-card">
                <div className="report-card-icon">{entity.icon}</div>
                <div className="report-card-label">{entity.label}</div>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => exportOne(entity)}
                  disabled={anyBusy}
                >
                  {exportingMap[entity.key] ? "⏳..." : "📊 Xuất"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
