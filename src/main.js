const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Database = require('./database');

let mainWindow;
let db;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: 'Quản Lý Kỹ Thuật',
    icon: path.join(__dirname, 'renderer', 'assets', 'icon.png'),
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  db = new Database();
  db.initialize();
  registerIpcHandlers();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (db) db.close();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

function registerIpcHandlers() {
  // Unit Info
  ipcMain.handle('get-unit-info', () => db.getUnitInfo());
  ipcMain.handle('save-unit-info', (_event, data) => db.saveUnitInfo(data));

  // Technical Area Overview
  ipcMain.handle('get-overview', () => db.getOverview());
  ipcMain.handle('save-overview', (_event, data) => db.saveOverview(data));

  // Staff
  ipcMain.handle('get-staff', () => db.getAll('staff'));
  ipcMain.handle('add-staff', (_event, data) => db.insert('staff', data));
  ipcMain.handle('update-staff', (_event, id, data) => db.update('staff', id, data));
  ipcMain.handle('delete-staff', (_event, id) => db.remove('staff', id));

  // Warehouses
  ipcMain.handle('get-warehouses', () => db.getAll('warehouses'));
  ipcMain.handle('add-warehouse', (_event, data) => db.insert('warehouses', data));
  ipcMain.handle('update-warehouse', (_event, id, data) => db.update('warehouses', id, data));
  ipcMain.handle('delete-warehouse', (_event, id) => db.remove('warehouses', id));

  // Warehouse sub-tables
  ipcMain.handle('get-warehouse-equipment', (_event, warehouseId) => db.getByWarehouse('warehouse_equipment', warehouseId));
  ipcMain.handle('add-warehouse-equipment', (_event, data) => db.insert('warehouse_equipment', data));
  ipcMain.handle('update-warehouse-equipment', (_event, id, data) => db.update('warehouse_equipment', id, data));
  ipcMain.handle('delete-warehouse-equipment', (_event, id) => db.remove('warehouse_equipment', id));

  ipcMain.handle('get-warehouse-inspections', (_event, warehouseId) => db.getByWarehouse('warehouse_inspections', warehouseId));
  ipcMain.handle('add-warehouse-inspection', (_event, data) => db.insert('warehouse_inspections', data));
  ipcMain.handle('update-warehouse-inspection', (_event, id, data) => db.update('warehouse_inspections', id, data));
  ipcMain.handle('delete-warehouse-inspection', (_event, id) => db.remove('warehouse_inspections', id));

  ipcMain.handle('get-warehouse-access', (_event, warehouseId) => db.getByWarehouse('warehouse_access', warehouseId));
  ipcMain.handle('add-warehouse-access', (_event, data) => db.insert('warehouse_access', data));
  ipcMain.handle('update-warehouse-access', (_event, id, data) => db.update('warehouse_access', id, data));
  ipcMain.handle('delete-warehouse-access', (_event, id) => db.remove('warehouse_access', id));

  ipcMain.handle('get-warehouse-handover', (_event, warehouseId) => db.getByWarehouse('warehouse_handover', warehouseId));
  ipcMain.handle('add-warehouse-handover', (_event, data) => db.insert('warehouse_handover', data));
  ipcMain.handle('update-warehouse-handover', (_event, id, data) => db.update('warehouse_handover', id, data));
  ipcMain.handle('delete-warehouse-handover', (_event, id) => db.remove('warehouse_handover', id));

  ipcMain.handle('get-warehouse-exports', (_event, warehouseId) => db.getByWarehouse('warehouse_exports', warehouseId));
  ipcMain.handle('add-warehouse-export', (_event, data) => db.insert('warehouse_exports', data));
  ipcMain.handle('update-warehouse-export', (_event, id, data) => db.update('warehouse_exports', id, data));
  ipcMain.handle('delete-warehouse-export', (_event, id) => db.remove('warehouse_exports', id));

  ipcMain.handle('get-warehouse-imports', (_event, warehouseId) => db.getByWarehouse('warehouse_imports', warehouseId));
  ipcMain.handle('add-warehouse-import', (_event, data) => db.insert('warehouse_imports', data));
  ipcMain.handle('update-warehouse-import', (_event, id, data) => db.update('warehouse_imports', id, data));
  ipcMain.handle('delete-warehouse-import', (_event, id) => db.remove('warehouse_imports', id));

  ipcMain.handle('get-warehouse-lightning', (_event, warehouseId) => db.getByWarehouse('warehouse_lightning', warehouseId));
  ipcMain.handle('add-warehouse-lightning', (_event, data) => db.insert('warehouse_lightning', data));
  ipcMain.handle('update-warehouse-lightning', (_event, id, data) => db.update('warehouse_lightning', id, data));
  ipcMain.handle('delete-warehouse-lightning', (_event, id) => db.remove('warehouse_lightning', id));

  // Weapons
  ipcMain.handle('get-weapons', () => db.getAll('weapons'));
  ipcMain.handle('add-weapon', (_event, data) => db.insert('weapons', data));
  ipcMain.handle('update-weapon', (_event, id, data) => db.update('weapons', id, data));
  ipcMain.handle('delete-weapon', (_event, id) => db.remove('weapons', id));

  // Technical Equipment
  ipcMain.handle('get-tech-equipment', () => db.getAll('tech_equipment'));
  ipcMain.handle('add-tech-equipment', (_event, data) => db.insert('tech_equipment', data));
  ipcMain.handle('update-tech-equipment', (_event, id, data) => db.update('tech_equipment', id, data));
  ipcMain.handle('delete-tech-equipment', (_event, id) => db.remove('tech_equipment', id));

  // Vehicles
  ipcMain.handle('get-vehicles', () => db.getAll('vehicles'));
  ipcMain.handle('add-vehicle', (_event, data) => db.insert('vehicles', data));
  ipcMain.handle('update-vehicle', (_event, id, data) => db.update('vehicles', id, data));
  ipcMain.handle('delete-vehicle', (_event, id) => db.remove('vehicles', id));

  // Materials
  ipcMain.handle('get-materials', () => db.getAll('materials'));
  ipcMain.handle('add-material', (_event, data) => db.insert('materials', data));
  ipcMain.handle('update-material', (_event, id, data) => db.update('materials', id, data));
  ipcMain.handle('delete-material', (_event, id) => db.remove('materials', id));
}
