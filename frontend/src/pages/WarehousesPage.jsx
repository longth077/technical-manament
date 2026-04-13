import { useState, useEffect, useCallback } from 'react';
import * as warehouseService from '../services/warehouseService';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import Alert from '../components/Alert';

const WH_COLUMNS = [
  { key: 'name', label: 'Kho trạm xưởng' },
  { key: 'function', label: 'Chức năng' },
  { key: 'keeper', label: 'Thủ kho' },
  { key: 'managingUnit', label: 'Đơn vị phụ trách' },
];

const WH_FIELDS = WH_COLUMNS.map((c) => ({ key: c.key, label: c.label }));

const SUB_TABS = [
  { key: 'overview', label: 'Tổng quan' },
  { key: 'equipment', label: 'Trang bị vật tư' },
  { key: 'inspections', label: 'Kiểm tra' },
  { key: 'access', label: 'Ra vào kho' },
  { key: 'handover', label: 'Giao nhận tạm thời' },
  { key: 'exports', label: 'Xuất kho' },
  { key: 'imports', label: 'Nhập kho' },
  { key: 'lightning', label: 'Chống sét' },
];

const SUB_COLUMNS = {
  equipment: [
    { key: 'name', label: 'Trang bị' },
    { key: 'unit', label: 'ĐVT' },
    { key: 'quantity', label: 'Số lượng' },
    { key: 'note', label: 'Ghi chú' },
  ],
  inspections: [
    { key: 'date', label: 'Ngày kiểm tra' },
    { key: 'content', label: 'Nội dung' },
    { key: 'result', label: 'Kết quả' },
    { key: 'inspector', label: 'Người kiểm tra' },
  ],
  access: [
    { key: 'date', label: 'Ngày' },
    { key: 'personName', label: 'Họ tên' },
    { key: 'purpose', label: 'Mục đích' },
    { key: 'note', label: 'Ghi chú' },
  ],
  handover: [
    { key: 'date', label: 'Ngày' },
    { key: 'fromPerson', label: 'Người giao' },
    { key: 'toPerson', label: 'Người nhận' },
    { key: 'content', label: 'Nội dung' },
    { key: 'note', label: 'Ghi chú' },
  ],
  exports: [
    { key: 'date', label: 'Ngày xuất' },
    { key: 'itemName', label: 'Tên hàng' },
    { key: 'quantity', label: 'Số lượng' },
    { key: 'receiver', label: 'Người nhận' },
    { key: 'note', label: 'Ghi chú' },
  ],
  imports: [
    { key: 'date', label: 'Ngày nhập' },
    { key: 'itemName', label: 'Tên hàng' },
    { key: 'quantity', label: 'Số lượng' },
    { key: 'supplier', label: 'Nguồn nhập' },
    { key: 'note', label: 'Ghi chú' },
  ],
  lightning: [
    { key: 'deviceName', label: 'Thiết bị' },
    { key: 'installDate', label: 'Ngày lắp đặt' },
    { key: 'status', label: 'Tình trạng' },
    { key: 'lastCheck', label: 'Lần kiểm tra cuối' },
    { key: 'note', label: 'Ghi chú' },
  ],
};

const SERVICE_MAP = {
  equipment: warehouseService.equipment,
  inspections: warehouseService.inspections,
  access: warehouseService.access,
  handover: warehouseService.handover,
  exports: warehouseService.exports_,
  imports: warehouseService.imports_,
  lightning: warehouseService.lightning,
};

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [subData, setSubData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [modal, setModal] = useState(null);
  const [whModal, setWhModal] = useState(null);

  const loadWarehouses = useCallback(async () => {
    const { data, error } = await warehouseService.getAll();
    if (error) setAlert({ message: error, type: 'error' });
    else setWarehouses(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => { loadWarehouses(); }, [loadWarehouses]);

  const loadSubData = useCallback(async () => {
    if (!selected || activeTab === 'overview') return;
    const svc = SERVICE_MAP[activeTab];
    if (!svc) return;
    const { data, error } = await svc.getAll(selected._id || selected.id);
    if (error) setAlert({ message: error, type: 'error' });
    else setSubData(Array.isArray(data) ? data : []);
  }, [selected, activeTab]);

  useEffect(() => { loadSubData(); }, [loadSubData]);

  // Warehouse CRUD
  const handleAddWh = () => setWhModal({ editing: null });
  const handleEditWh = (row) => setWhModal({ editing: row });
  const handleDeleteWh = async (row) => {
    if (!confirm('Bạn có chắc chắn muốn xoá kho này?')) return;
    const { error } = await warehouseService.remove(row._id || row.id);
    if (error) setAlert({ message: error, type: 'error' });
    else {
      if (selected && (selected._id || selected.id) === (row._id || row.id)) setSelected(null);
      loadWarehouses();
    }
  };
  const handleWhSubmit = async (formData) => {
    const editing = whModal?.editing;
    const { error } = editing
      ? await warehouseService.update(editing._id || editing.id, formData)
      : await warehouseService.create(formData);
    if (error) setAlert({ message: error, type: 'error' });
    else { setWhModal(null); loadWarehouses(); }
  };

  // Sub-item CRUD
  const handleAddSub = () => setModal({ editing: null });
  const handleEditSub = (row) => setModal({ editing: row });
  const handleDeleteSub = async (row) => {
    if (!confirm('Xoá mục này?')) return;
    const svc = SERVICE_MAP[activeTab];
    const { error } = await svc.remove(selected._id || selected.id, row._id || row.id);
    if (error) setAlert({ message: error, type: 'error' });
    else loadSubData();
  };
  const handleSubSubmit = async (formData) => {
    const svc = SERVICE_MAP[activeTab];
    const wId = selected._id || selected.id;
    const editing = modal?.editing;
    const { error } = editing
      ? await svc.update(wId, editing._id || editing.id, formData)
      : await svc.add(wId, formData);
    if (error) setAlert({ message: error, type: 'error' });
    else { setModal(null); loadSubData(); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Kho Trạm Xưởng</h2>
        <button className="btn btn-success" onClick={handleAddWh}>+ Thêm kho</button>
      </div>

      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

      <div className="warehouse-layout">
        {/* Left panel: warehouse list */}
        <div className="warehouse-list">
          <DataTable
            columns={WH_COLUMNS}
            data={warehouses}
            onEdit={handleEditWh}
            onDelete={handleDeleteWh}
          />
          <div className="warehouse-select-list">
            {warehouses.map((wh) => (
              <button
                key={wh._id || wh.id}
                className={'btn btn-sm' + ((selected && (selected._id || selected.id) === (wh._id || wh.id)) ? ' btn-primary' : ' btn-secondary')}
                onClick={() => { setSelected(wh); setActiveTab('overview'); }}
              >
                {wh.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right panel: detail */}
        {selected && (
          <div className="warehouse-detail">
            <h3>{selected.name}</h3>
            <div className="sub-tabs">
              {SUB_TABS.map((tab) => (
                <button
                  key={tab.key}
                  className={'btn btn-sm' + (activeTab === tab.key ? ' btn-primary' : ' btn-secondary')}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'overview' ? (
              <div className="warehouse-overview">
                <p><strong>Chức năng:</strong> {selected.function}</p>
                <p><strong>Thủ kho:</strong> {selected.keeper}</p>
                <p><strong>Đơn vị phụ trách:</strong> {selected.managingUnit}</p>
              </div>
            ) : (
              <>
                <div className="page-header">
                  <span />
                  <button className="btn btn-success btn-sm" onClick={handleAddSub}>+ Thêm</button>
                </div>
                <DataTable
                  columns={SUB_COLUMNS[activeTab] || []}
                  data={subData}
                  onEdit={handleEditSub}
                  onDelete={handleDeleteSub}
                />
              </>
            )}
          </div>
        )}
      </div>

      {whModal && (
        <FormModal
          title={whModal.editing ? 'Sửa kho' : 'Thêm kho'}
          fields={WH_FIELDS}
          initialData={whModal.editing}
          onSubmit={handleWhSubmit}
          onClose={() => setWhModal(null)}
        />
      )}

      {modal && activeTab !== 'overview' && (
        <FormModal
          title={modal.editing ? 'Sửa' : 'Thêm mới'}
          fields={(SUB_COLUMNS[activeTab] || []).map((c) => ({ key: c.key, label: c.label }))}
          initialData={modal.editing}
          onSubmit={handleSubSubmit}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
