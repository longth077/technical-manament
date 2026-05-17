import { useCallback, useEffect, useRef, useState } from "react";
import { Api } from "../services/api";
import warehouseSample from "../assets/warehouse-sample.svg";

const BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3001/api"
).replace(/\/api$/, "");

/** Derive a browser-accessible URL from the absolute file_path stored in DB */
function getImageUrl(filePath) {
  const filename = String(filePath).replace(/\\/g, "/").split("/").pop();
  return `${BASE_URL}/uploads/warehouse_images/${filename}`;
}

export default function WarehouseGallery({ warehouse, credential, canEdit, onBack }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [fileTypeOptions, setFileTypeOptions] = useState([]);
  const [fileTypeId, setFileTypeId] = useState("");
  const [previewFile, setPreviewFile] = useState(null); // { file, objectUrl }
  const fileInputRef = useRef(null);

  // Lightbox
  const [lightboxIdx, setLightboxIdx] = useState(null); // index into images[]
  const lightbox = lightboxIdx !== null ? images[lightboxIdx] : null;

  const openLightbox = (img) => setLightboxIdx(images.indexOf(img));
  const closeLightbox = () => setLightboxIdx(null);
  const prevImage = () => setLightboxIdx((i) => (i > 0 ? i - 1 : images.length - 1));
  const nextImage = () => setLightboxIdx((i) => (i < images.length - 1 ? i + 1 : 0));

  // Keyboard navigation in lightbox
  useEffect(() => {
    if (lightboxIdx === null) return;
    const len = images.length;
    const handler = (e) => {
      if (e.key === "ArrowRight") setLightboxIdx((i) => (i < len - 1 ? i + 1 : 0));
      else if (e.key === "ArrowLeft") setLightboxIdx((i) => (i > 0 ? i - 1 : len - 1));
      else if (e.key === "Escape") setLightboxIdx(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIdx, images.length]);

  // Delete state
  const [deletingId, setDeletingId] = useState(null);

  const loadImages = useCallback(() => {
    setLoading(true);
    setError("");
    Api.listEntity("warehouse_images", credential, {
      warehouse_id: warehouse.id,
    })
      .then((data) => setImages(data.rows || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [warehouse.id, credential]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  // Load file type enum options once
  useEffect(() => {
    Api.listEnumByType("warehouse_image_file_type", credential)
      .then((data) => {
        const opts = data.rows || [];
        setFileTypeOptions(opts);
        if (opts.length > 0) setFileTypeId(String(opts[0].id));
      })
      .catch(() => {});
  }, [credential]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Auto-select matching file type
    const matchedOpt = fileTypeOptions.find((o) => o.enum === file.type);
    if (matchedOpt) setFileTypeId(String(matchedOpt.id));
    // Preview
    if (previewFile?.objectUrl) URL.revokeObjectURL(previewFile.objectUrl);
    setPreviewFile({ file, objectUrl: URL.createObjectURL(file) });
    setUploadError("");
  };

  const handleUpload = async () => {
    if (!previewFile?.file) {
      setUploadError("Vui lòng chọn file ảnh");
      return;
    }
    setUploading(true);
    setUploadError("");
    try {
      await Api.uploadWarehouseImage(
        warehouse.id,
        previewFile.file,
        fileTypeId,
        uploadDesc,
        credential,
      );
      // Reset upload form
      URL.revokeObjectURL(previewFile.objectUrl);
      setPreviewFile(null);
      setUploadDesc("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      loadImages();
    } catch (e) {
      setUploadError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa ảnh này?")) return;
    setDeletingId(id);
    try {
      await Api.deleteWarehouseImage(id, credential);
      if (lightbox?.id === id) closeLightbox();
      loadImages();
    } catch (e) {
      setError(e.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (previewFile?.objectUrl) URL.revokeObjectURL(previewFile.objectUrl);
    };
  }, [previewFile]);

  return (
    <section className="entity-section warehouse-gallery">
      {/* ── Header ── */}
      <div className="panel">
        <div className="panel-header">
          <div className="gallery-header-left">
            <button className="btn btn-sm btn-outline" onClick={onBack}>
              ← Quay lại
            </button>
            <h3>
              🖼️ Ảnh kho: <span className="gallery-warehouse-code">{warehouse.code}</span>
            </h3>
          </div>
          <div className="panel-header-actions">
            <button className="btn btn-sm btn-outline" onClick={loadImages}>
              ↻ Làm mới
            </button>
          </div>
        </div>

        {/* Warehouse info strip */}
        <div className="gallery-warehouse-info">
          {warehouse.function_desc && (
            <span><strong>Chức năng:</strong> {warehouse.function_desc}</span>
          )}
          {warehouse.managing_unit && (
            <span><strong>Đơn vị:</strong> {warehouse.managing_unit}</span>
          )}
          {warehouse.area && (
            <span><strong>Diện tích:</strong> {warehouse.area}</span>
          )}
        </div>

        {error && (
          <div className="error-msg" style={{ margin: "0.75rem 1.25rem 0" }}>
            {error}
          </div>
        )}

        {/* ── Upload panel ── */}
        {canEdit && (
          <div className="gallery-upload-panel">
            <div className="gallery-upload-title">📤 Tải ảnh lên</div>
            <div className="gallery-upload-row">
              <label className="gallery-upload-file-label">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFileSelect}
                  className="gallery-upload-file-input"
                />
                <span className="btn btn-sm btn-outline">📁 Chọn ảnh</span>
              </label>

              {fileTypeOptions.length > 0 && (
                <label className="gallery-upload-type">
                  <span>Loại:</span>
                  <select
                    value={fileTypeId}
                    onChange={(e) => setFileTypeId(e.target.value)}
                    className="filter-input filter-select"
                  >
                    {fileTypeOptions.map((o) => (
                      <option key={o.id} value={String(o.id)}>
                        {o.enum}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <input
                type="text"
                placeholder="Mô tả (tuỳ chọn)"
                value={uploadDesc}
                onChange={(e) => setUploadDesc(e.target.value)}
                className="filter-input gallery-upload-desc"
              />

              <button
                className="btn btn-sm btn-primary"
                onClick={handleUpload}
                disabled={uploading || !previewFile}
              >
                {uploading ? "⏳ Đang tải..." : "⬆ Tải lên"}
              </button>
            </div>

            {/* Preview before upload */}
            {previewFile && (
              <div className="gallery-preview-wrap">
                <span className="gallery-preview-label">Xem trước:</span>
                <img
                  src={previewFile.objectUrl}
                  alt="preview"
                  className="gallery-preview-img"
                />
                <span className="gallery-preview-name">{previewFile.file.name}</span>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => {
                    URL.revokeObjectURL(previewFile.objectUrl);
                    setPreviewFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  ✕
                </button>
              </div>
            )}

            {uploadError && (
              <div className="error-msg" style={{ marginTop: "0.5rem" }}>
                {uploadError}
              </div>
            )}
          </div>
        )}

        {/* ── Image grid ── */}
        <div className="panel-body-flush gallery-body">
          {loading ? (
            <div className="loading-bar">Đang tải ảnh...</div>
          ) : images.length === 0 ? (
            /* ── Sample placeholder when no images yet ── */
            <div className="gallery-empty">
              <div className="gallery-sample-wrap">
                <div className="gallery-sample-label">Ảnh minh hoạ — chưa có ảnh thực tế</div>
                <img
                  src={warehouseSample}
                  alt="Ảnh mẫu kho"
                  className="gallery-sample-img"
                />
              </div>
              <p className="gallery-empty-hint">
                {canEdit
                  ? "Sử dụng nút \u201cTải ảnh lên\u201d phía trên để thêm ảnh cho kho này."
                  : "Chưa có ảnh nào được tải lên cho kho này."}
              </p>
            </div>
          ) : (
            <div className="gallery-grid">
              {images.map((img) => (
                <div key={img.id} className="gallery-card">
                  <div
                    className="gallery-card-img-wrap"
                    onClick={() => openLightbox(img)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && openLightbox(img)}
                    title="Nhấn để xem to"
                  >
                    <img
                      src={getImageUrl(img.file_path)}
                      alt={img.description || `Ảnh kho ${warehouse.code}`}
                      className="gallery-card-img"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = warehouseSample;
                        e.currentTarget.style.opacity = "0.5";
                      }}
                    />
                    <div className="gallery-card-overlay">🔍 Xem</div>
                  </div>
                  <div className="gallery-card-footer">
                    <span className="gallery-card-desc" title={img.description}>
                      {img.description || <em className="text-muted">Không có mô tả</em>}
                    </span>
                    <span className="gallery-card-date">
                      {img.uploaded_at
                        ? new Date(img.uploaded_at).toLocaleDateString("vi-VN")
                        : ""}
                    </span>
                    {canEdit && (
                      <button
                        className="btn btn-sm btn-danger gallery-card-del"
                        onClick={() => handleDelete(img.id)}
                        disabled={deletingId === img.id}
                        title="Xóa ảnh"
                      >
                        {deletingId === img.id ? "..." : "🗑"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {lightbox && (
        <div
          className="gallery-lightbox"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="gallery-lightbox-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="gallery-lightbox-close"
              onClick={closeLightbox}
            >
              ✕
            </button>

            {/* Prev button */}
            {images.length > 1 && (
              <button
                className="gallery-lightbox-nav gallery-lightbox-prev"
                onClick={prevImage}
                title="Ảnh trước"
              >
                ‹
              </button>
            )}

            <img
              src={getImageUrl(lightbox.file_path)}
              alt={lightbox.description || "Ảnh kho"}
              className="gallery-lightbox-img"
              onError={(e) => {
                e.currentTarget.src = warehouseSample;
              }}
            />

            {/* Next button */}
            {images.length > 1 && (
              <button
                className="gallery-lightbox-nav gallery-lightbox-next"
                onClick={nextImage}
                title="Ảnh tiếp theo"
              >
                ›
              </button>
            )}

            {/* Counter */}
            {images.length > 1 && (
              <div className="gallery-lightbox-counter">
                {lightboxIdx + 1} / {images.length}
              </div>
            )}

            {lightbox.description && (
              <div className="gallery-lightbox-caption">{lightbox.description}</div>
            )}
            {lightbox.uploaded_at && (
              <div className="gallery-lightbox-date">
                Ngày tải:{" "}
                {new Date(lightbox.uploaded_at).toLocaleString("vi-VN")}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
