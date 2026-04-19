import { useState, useEffect, useCallback } from 'react';
import * as staffService from '../services/staffService';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import Alert from '../components/Alert';
import ExcelButtons from '../components/ExcelButtons';

const COLUMNS = [
  { key: 'fullName', label: 'Họ và tên' },
  { key: 'dateOfBirth', label: 'Ngày tháng năm sinh' },
  { key: 'idNumber', label: 'Số CMTQĐ/CCCD' },
  { key: 'rank', label: 'Cấp bậc' },
  { key: 'position', label: 'Chức vụ' },
  { key: 'unit', label: 'Đơn vị bộ phận' },
  { key: 'education', label: 'Trình độ đào tạo' },
  { key: 'warehouse', label: 'Kho trạm xưởng đảm nhiệm' },
  { key: 'weapon', label: 'VKTB đảm nhiệm' },
  { key: 'vehicle', label: 'Phương tiện đảm nhiệm' },
  { key: 'material', label: 'Trang bị vật tư đảm nhiệm' },
];

const FORM_FIELDS = COLUMNS.map((c) => ({ key: c.key, label: c.label }));

export default function StaffPage() {
  const [data, setData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [modal, setModal] = useState(null); // { editing: row|null }

  const load = useCallback(async () => {
    const { data: list, error } = await staffService.getAll();
    if (error) setAlert({ message: error, type: 'error' });
    else setData(Array.isArray(list) ? list : []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = () => setModal({ editing: null });

  const handleEdit = (row) => setModal({ editing: row });

  const handleDelete = async (row) => {
    if (!confirm('Bạn có chắc chắn muốn xoá?')) return;
    const { error } = await staffService.remove(row._id || row.id);
    if (error) setAlert({ message: error, type: 'error' });
    else {
      setAlert({ message: 'Đã xoá thành công', type: 'success' });
      load();
    }
  };

  const handleSubmit = async (formData) => {
    const editing = modal?.editing;
    const { error } = editing
      ? await staffService.update(editing._id || editing.id, formData)
      : await staffService.create(formData);
    if (error) {
      setAlert({ message: error, type: 'error' });
    } else {
      setAlert({ message: editing ? 'Cập nhật thành công' : 'Thêm mới thành công', type: 'success' });
      setModal(null);
      load();
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Danh Sách Cán Bộ, Nhân Viên Kỹ Thuật</h2>
        <div className="page-header-actions">
          <ExcelButtons
            exportUrl="/api/excel/staff/export"
            importUrl="/api/excel/staff/import"
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
          title={modal.editing ? 'Sửa cán bộ' : 'Thêm cán bộ'}
          fields={FORM_FIELDS}
          initialData={modal.editing}
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
