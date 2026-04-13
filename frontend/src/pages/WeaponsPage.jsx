import { useState, useEffect, useCallback } from 'react';
import * as weaponService from '../services/weaponService';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import Alert from '../components/Alert';

const COLUMNS = [
  { key: 'name', label: 'Vũ khí trang bị' },
  { key: 'classification', label: 'Phân cấp' },
  { key: 'unit', label: 'Đơn vị tính' },
  { key: 'quantity', label: 'Số lượng' },
  { key: 'country', label: 'Nước sản xuất' },
  { key: 'year', label: 'Năm sản xuất' },
  { key: 'unitAllocation', label: 'Biên chế đơn vị' },
  { key: 'personalAllocation', label: 'Biên chế cá nhân' },
];

const FORM_FIELDS = COLUMNS.map((c) => ({ key: c.key, label: c.label }));

export default function WeaponsPage() {
  const [data, setData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    const { data: list, error } = await weaponService.getAll();
    if (error) setAlert({ message: error, type: 'error' });
    else setData(Array.isArray(list) ? list : []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = () => setModal({ editing: null });
  const handleEdit = (row) => setModal({ editing: row });

  const handleDelete = async (row) => {
    if (!confirm('Bạn có chắc chắn muốn xoá?')) return;
    const { error } = await weaponService.remove(row._id || row.id);
    if (error) setAlert({ message: error, type: 'error' });
    else { setAlert({ message: 'Đã xoá', type: 'success' }); load(); }
  };

  const handleSubmit = async (formData) => {
    const editing = modal?.editing;
    const { error } = editing
      ? await weaponService.update(editing._id || editing.id, formData)
      : await weaponService.create(formData);
    if (error) setAlert({ message: error, type: 'error' });
    else { setModal(null); load(); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Vũ Khí Trang Bị</h2>
        <button className="btn btn-success" onClick={handleAdd}>+ Thêm mới</button>
      </div>
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      <DataTable columns={COLUMNS} data={data} onEdit={handleEdit} onDelete={handleDelete} />
      {modal && (
        <FormModal
          title={modal.editing ? 'Sửa vũ khí' : 'Thêm vũ khí'}
          fields={FORM_FIELDS}
          initialData={modal.editing}
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
