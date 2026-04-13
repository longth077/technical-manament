const excelService = require('../services/ExcelService');
const {
  staffColumns,
  weaponColumns,
  techEquipmentColumns,
  vehicleColumns,
  materialColumns,
  warehouseColumns,
  warehouseSubColumns,
} = require('../config/excelColumns');

// Services
const staffService = require('../services/StaffService');
const weaponService = require('../services/WeaponService');
const techEquipmentService = require('../services/TechEquipmentService');
const vehicleService = require('../services/VehicleService');
const materialService = require('../services/MaterialService');
const warehouseService = require('../services/WarehouseService');

const resourceConfig = {
  staff: { columns: staffColumns, service: staffService, sheetName: 'Cán bộ CMKT', fileName: 'can-bo-cmkt' },
  weapons: { columns: weaponColumns, service: weaponService, sheetName: 'Vũ khí trang bị', fileName: 'vu-khi-trang-bi' },
  'tech-equipment': { columns: techEquipmentColumns, service: techEquipmentService, sheetName: 'Trang thiết bị KT', fileName: 'trang-thiet-bi-kt' },
  vehicles: { columns: vehicleColumns, service: vehicleService, sheetName: 'Phương tiện', fileName: 'phuong-tien' },
  materials: { columns: materialColumns, service: materialService, sheetName: 'Vật tư', fileName: 'vat-tu' },
  warehouses: { columns: warehouseColumns, service: warehouseService, sheetName: 'Kho trạm xưởng', fileName: 'kho-tram-xuong' },
};

class ExcelController {
  async exportResource(req, res, next) {
    try {
      const { resource } = req.params;
      const config = resourceConfig[resource];
      if (!config) {
        return res.status(400).json({ message: `Unknown resource: ${resource}` });
      }

      const data = await config.service.getAll();
      const buffer = await excelService.exportToExcel(config.columns, data, config.sheetName);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${config.fileName}.xlsx"`);
      res.send(Buffer.from(buffer));
    } catch (error) {
      next(error);
    }
  }

  async importResource(req, res, next) {
    try {
      const { resource } = req.params;
      const config = resourceConfig[resource];
      if (!config) {
        return res.status(400).json({ message: `Unknown resource: ${resource}` });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const rows = await excelService.parseExcel(req.file.buffer, config.columns);
      
      if (rows.length === 0) {
        return res.status(400).json({ message: 'No valid data found in the uploaded file' });
      }

      let created = 0;
      for (const row of rows) {
        await config.service.create(row);
        created++;
      }

      res.json({ message: `Successfully imported ${created} records`, count: created });
    } catch (error) {
      next(error);
    }
  }

  async exportWarehouseSub(req, res, next) {
    try {
      const { warehouseId, type } = req.params;
      const columns = warehouseSubColumns[type];
      if (!columns) {
        return res.status(400).json({ message: `Unknown warehouse sub-type: ${type}` });
      }

      const data = await warehouseService.getSubItems(warehouseId, type);
      const buffer = await excelService.exportToExcel(columns, data, type);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="warehouse-${warehouseId}-${type}.xlsx"`);
      res.send(Buffer.from(buffer));
    } catch (error) {
      next(error);
    }
  }

  async importWarehouseSub(req, res, next) {
    try {
      const { warehouseId, type } = req.params;
      const columns = warehouseSubColumns[type];
      if (!columns) {
        return res.status(400).json({ message: `Unknown warehouse sub-type: ${type}` });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const rows = await excelService.parseExcel(req.file.buffer, columns);
      
      if (rows.length === 0) {
        return res.status(400).json({ message: 'No valid data found in the uploaded file' });
      }

      let created = 0;
      for (const row of rows) {
        await warehouseService.addSubItem(warehouseId, type, row);
        created++;
      }

      res.json({ message: `Successfully imported ${created} records`, count: created });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ExcelController();
