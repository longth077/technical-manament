import { useState, useEffect } from 'react';

export default function FormModal({ title, fields, initialData, onSubmit, onClose }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const initial = {};
    fields.forEach((f) => {
      initial[f.key] = (initialData && initialData[f.key]) || '';
    });
    setFormData(initial);
  }, [fields, initialData]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {fields.map((f) => (
              <div className="form-group" key={f.key}>
                <label>
                  {f.label}
                  {f.required && <span className="required">*</span>}
                </label>
                {f.type === 'textarea' ? (
                  <textarea
                    value={formData[f.key] || ''}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                    required={f.required}
                    rows={3}
                  />
                ) : (
                  <input
                    type={f.type || 'text'}
                    value={formData[f.key] || ''}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                    required={f.required}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Huỷ
            </button>
            <button type="submit" className="btn btn-primary">
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
