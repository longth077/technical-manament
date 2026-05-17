import { useEffect, useState } from "react";
import { Api } from "../services/api";
import warehouseSample from "../assets/warehouse-sample.svg";

const BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3001/api"
).replace(/\/api$/, "");

function getThumbUrl(filePath) {
  if (!filePath) return null;
  const filename = filePath.split(/[\\/]/).pop();
  return `${BASE_URL}/uploads/warehouse_images/${filename}`;
}

export default function WarehouseImageOverview({
  credential,
  canEdit,
  onViewGallery,
}) {
  const [warehouses, setWarehouses] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      Api.listEntity("warehouses", credential),
      Api.listEntity("warehouse_images", credential),
    ])
      .then(([wData, iData]) => {
        if (!active) return;
        setWarehouses(wData.rows || []);
        setImages(iData.rows || []);
        setError("");
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
  }, [credential]);

  // Group images by warehouse_id
  const imagesByWarehouse = {};
  for (const img of images) {
    const wid = String(img.warehouse_id);
    if (!imagesByWarehouse[wid]) imagesByWarehouse[wid] = [];
    imagesByWarehouse[wid].push(img);
  }

  const totalImages = images.length;
  const warehousesWithImages = warehouses.filter(
    (w) => (imagesByWarehouse[String(w.id)] || []).length > 0,
  ).length;

  return (
    <section className="entity-section">
      <div className="panel">
        <div className="panel-header">
          <h3>🖼️ Ảnh kho trạm xưởng</h3>
          <div className="panel-header-actions">
            <span className="wio-summary-badge">
              {totalImages} ảnh / {warehouses.length} kho
            </span>
          </div>
        </div>

        {error && (
          <div className="error-msg" style={{ margin: "0.75rem 1.25rem 0" }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-bar">Đang tải dữ liệu...</div>
        ) : warehouses.length === 0 ? (
          <div className="empty-state">Chưa có kho nào trong hệ thống</div>
        ) : (
          <>
            {warehousesWithImages === 0 && (
              <div
                className="info-msg"
                style={{ margin: "0.75rem 1.25rem 0" }}
              >
                Chưa có ảnh nào được tải lên. Nhấn vào một kho để bắt đầu tải
                ảnh.
              </div>
            )}
            <div className="wio-grid">
              {warehouses.map((w) => {
                const wImages = imagesByWarehouse[String(w.id)] || [];
                const thumb =
                  wImages[0]?.file_path
                    ? getThumbUrl(wImages[0].file_path)
                    : null;
                return (
                  <div
                    key={w.id}
                    className="wio-card"
                    onClick={() => onViewGallery(w)}
                    title={`Xem ảnh ${w.code}`}
                  >
                    <div className="wio-thumb">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={w.code}
                          onError={(e) => {
                            e.currentTarget.src = warehouseSample;
                          }}
                        />
                      ) : (
                        <img src={warehouseSample} alt={w.code} />
                      )}
                      {wImages.length > 0 && (
                        <span className="wio-count-badge">
                          {wImages.length}
                        </span>
                      )}
                    </div>
                    <div className="wio-info">
                      <div className="wio-code">{w.code}</div>
                      <div className="wio-desc">{w.function_desc}</div>
                      <div className="wio-meta">
                        {wImages.length > 0
                          ? `${wImages.length} ảnh`
                          : "Chưa có ảnh"}
                      </div>
                    </div>
                    {canEdit && (
                      <div className="wio-action-hint">
                        📷 {wImages.length > 0 ? "Xem / Thêm ảnh" : "Tải ảnh lên"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
