import { useState, useEffect, useCallback } from 'react';
import * as techEquipmentService from '../services/techEquipmentService';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import Alert from '../components/Alert';
import ExcelButtons from '../components/ExcelButtons';

const COLUMNS = [
  { key: 'name', label: 'Trang thiết bị KT' },
  { key: 'classification', label: 'Phân cấp' },
  { key: 'unit', label: 'ĐVT' },
  { key: 'quantity', label: 'Số lượng' },
  { key: 'country', label: 'Nước SX' },
  { key: 'year', label: 'Năm SX' },
  { key: 'unitAllocation', label: 'BC đơn vị' },
  { key: 'personalAllocation', label: 'BC cá nhân' },
  { key: 'repair', label: 'Sửa chữa' },
  { key: 'operatingHours', label: 'Số giờ hoạt động' },
];

const FORM_FIELDS = COLUMNS.map((c) => ({ key: c.key, label: c.label }));

export default function TechEquipmentPage() {
  const [data, setData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    const { data: list, error } = await techEquipmentService.getAll();
    if (error) setAlert({ message: error, type: 'error' });
    else setData(Array.isArray(list) ? list : []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = () => setModal({ editing: null });
  const handleEdit = (row) => setModal({ editing: row });

  const handleDelete = async (row) => {
    if (!confirm('Bạn có chắc chắn muốn xoá?')) return;
    const { error } = await techEquipmentService.remove(row._id || row.id);
    if (error) setAlert({ message: error, type: 'error' });
    else { setAlert({ message: 'Đã xoá', type: 'success' }); load(); }
  };

  const handleSubmit = async (formData) => {
    const editing = modal?.editing;
    const { error } = editing
      ? await techEquipmentService.update(editing._id || editing.id, formData)
      : await techEquipmentService.create(formData);
    if (error) setAlert({ message: error, type: 'error' });
    else { setModal(null); load(); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Trang Thiết Bị Kỹ Thuật</h2>
        <div className="page-header-actions">
          <ExcelButtons
            exportUrl="/api/excel/tech-equipment/export"
            importUrl="/api/excel/tech-equipment/import"
            onImportSuccess={(msg) => { setAlert({ message: msg, type: 'success' }); load(); }}
            onError={(msg) => setAlert({ message: msg, type: 'error' })}
          />
          <button className="btn btn-success" onClick={handleAdd}>+ Thêm mới</button>
        </div>
      </div>
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      <DataTable columns={COLUMNS} data={data} onEdit={handleEdit} onDelete={handleDelete} />
      {modal && (
        <FormModal
          title={modal.editing ? 'Sửa trang thiết bị' : 'Thêm trang thiết bị'}
          fields={FORM_FIELDS}
          initialData={modal.editing}
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
