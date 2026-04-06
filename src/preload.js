const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Unit Info
  getUnitInfo: () => ipcRenderer.invoke('get-unit-info'),
  saveUnitInfo: (data) => ipcRenderer.invoke('save-unit-info', data),

  // Overview
  getOverview: () => ipcRenderer.invoke('get-overview'),
  saveOverview: (data) => ipcRenderer.invoke('save-overview', data),

  // Staff
  getStaff: () => ipcRenderer.invoke('get-staff'),
  addStaff: (data) => ipcRenderer.invoke('add-staff', data),
  updateStaff: (id, data) => ipcRenderer.invoke('update-staff', id, data),
  deleteStaff: (id) => ipcRenderer.invoke('delete-staff', id),

  // Warehouses
  getWarehouses: () => ipcRenderer.invoke('get-warehouses'),
  addWarehouse: (data) => ipcRenderer.invoke('add-warehouse', data),
  updateWarehouse: (id, data) => ipcRenderer.invoke('update-warehouse', id, data),
  deleteWarehouse: (id) => ipcRenderer.invoke('delete-warehouse', id),

  // Warehouse Equipment
  getWarehouseEquipment: (wId) => ipcRenderer.invoke('get-warehouse-equipment', wId),
  addWarehouseEquipment: (data) => ipcRenderer.invoke('add-warehouse-equipment', data),
  updateWarehouseEquipment: (id, data) => ipcRenderer.invoke('update-warehouse-equipment', id, data),
  deleteWarehouseEquipment: (id) => ipcRenderer.invoke('delete-warehouse-equipment', id),

  // Warehouse Inspections
  getWarehouseInspections: (wId) => ipcRenderer.invoke('get-warehouse-inspections', wId),
  addWarehouseInspection: (data) => ipcRenderer.invoke('add-warehouse-inspection', data),
  updateWarehouseInspection: (id, data) => ipcRenderer.invoke('update-warehouse-inspection', id, data),
  deleteWarehouseInspection: (id) => ipcRenderer.invoke('delete-warehouse-inspection', id),

  // Warehouse Access
  getWarehouseAccess: (wId) => ipcRenderer.invoke('get-warehouse-access', wId),
  addWarehouseAccess: (data) => ipcRenderer.invoke('add-warehouse-access', data),
  updateWarehouseAccess: (id, data) => ipcRenderer.invoke('update-warehouse-access', id, data),
  deleteWarehouseAccess: (id) => ipcRenderer.invoke('delete-warehouse-access', id),

  // Warehouse Handover
  getWarehouseHandover: (wId) => ipcRenderer.invoke('get-warehouse-handover', wId),
  addWarehouseHandover: (data) => ipcRenderer.invoke('add-warehouse-handover', data),
  updateWarehouseHandover: (id, data) => ipcRenderer.invoke('update-warehouse-handover', id, data),
  deleteWarehouseHandover: (id) => ipcRenderer.invoke('delete-warehouse-handover', id),

  // Warehouse Exports
  getWarehouseExports: (wId) => ipcRenderer.invoke('get-warehouse-exports', wId),
  addWarehouseExport: (data) => ipcRenderer.invoke('add-warehouse-export', data),
  updateWarehouseExport: (id, data) => ipcRenderer.invoke('update-warehouse-export', id, data),
  deleteWarehouseExport: (id) => ipcRenderer.invoke('delete-warehouse-export', id),

  // Warehouse Imports
  getWarehouseImports: (wId) => ipcRenderer.invoke('get-warehouse-imports', wId),
  addWarehouseImport: (data) => ipcRenderer.invoke('add-warehouse-import', data),
  updateWarehouseImport: (id, data) => ipcRenderer.invoke('update-warehouse-import', id, data),
  deleteWarehouseImport: (id) => ipcRenderer.invoke('delete-warehouse-import', id),

  // Warehouse Lightning
  getWarehouseLightning: (wId) => ipcRenderer.invoke('get-warehouse-lightning', wId),
  addWarehouseLightning: (data) => ipcRenderer.invoke('add-warehouse-lightning', data),
  updateWarehouseLightning: (id, data) => ipcRenderer.invoke('update-warehouse-lightning', id, data),
  deleteWarehouseLightning: (id) => ipcRenderer.invoke('delete-warehouse-lightning', id),

  // Weapons
  getWeapons: () => ipcRenderer.invoke('get-weapons'),
  addWeapon: (data) => ipcRenderer.invoke('add-weapon', data),
  updateWeapon: (id, data) => ipcRenderer.invoke('update-weapon', id, data),
  deleteWeapon: (id) => ipcRenderer.invoke('delete-weapon', id),

  // Technical Equipment
  getTechEquipment: () => ipcRenderer.invoke('get-tech-equipment'),
  addTechEquipment: (data) => ipcRenderer.invoke('add-tech-equipment', data),
  updateTechEquipment: (id, data) => ipcRenderer.invoke('update-tech-equipment', id, data),
  deleteTechEquipment: (id) => ipcRenderer.invoke('delete-tech-equipment', id),

  // Vehicles
  getVehicles: () => ipcRenderer.invoke('get-vehicles'),
  addVehicle: (data) => ipcRenderer.invoke('add-vehicle', data),
  updateVehicle: (id, data) => ipcRenderer.invoke('update-vehicle', id, data),
  deleteVehicle: (id) => ipcRenderer.invoke('delete-vehicle', id),

  // Materials
  getMaterials: () => ipcRenderer.invoke('get-materials'),
  addMaterial: (data) => ipcRenderer.invoke('add-material', data),
  updateMaterial: (id, data) => ipcRenderer.invoke('update-material', id, data),
  deleteMaterial: (id) => ipcRenderer.invoke('delete-material', id),
});
