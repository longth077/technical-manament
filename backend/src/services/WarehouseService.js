const warehouseRepository = require('../repositories/WarehouseRepository');
const WarehouseSubRepository = require('../repositories/WarehouseSubRepository');
const {
  WarehouseEquipment,
  WarehouseInspection,
  WarehouseAccess,
  WarehouseHandover,
  WarehouseExport,
  WarehouseImport,
  WarehouseLightning,
} = require('../models');

const subRepos = {
  equipment: new WarehouseSubRepository(WarehouseEquipment),
  inspections: new WarehouseSubRepository(WarehouseInspection),
  access: new WarehouseSubRepository(WarehouseAccess),
  handover: new WarehouseSubRepository(WarehouseHandover),
  exports: new WarehouseSubRepository(WarehouseExport),
  imports: new WarehouseSubRepository(WarehouseImport),
  lightning: new WarehouseSubRepository(WarehouseLightning),
};

class WarehouseService {
  async getAll() {
    return warehouseRepository.findAll();
  }

  async getById(id) {
    const warehouse = await warehouseRepository.findWithDetails(id);
    if (!warehouse) {
      const error = new Error('Warehouse not found');
      error.statusCode = 404;
      throw error;
    }
    return warehouse;
  }

  async create(data) {
    return warehouseRepository.create(data);
  }

  async update(id, data) {
    const warehouse = await warehouseRepository.update(id, data);
    if (!warehouse) {
      const error = new Error('Warehouse not found');
      error.statusCode = 404;
      throw error;
    }
    return warehouse;
  }

  async delete(id) {
    const warehouse = await warehouseRepository.delete(id);
    if (!warehouse) {
      const error = new Error('Warehouse not found');
      error.statusCode = 404;
      throw error;
    }
    return warehouse;
  }

  _getSubRepo(type) {
    const repo = subRepos[type];
    if (!repo) {
      const error = new Error(`Invalid sub-table type: ${type}`);
      error.statusCode = 400;
      throw error;
    }
    return repo;
  }

  async getSubItems(warehouseId, type) {
    const repo = this._getSubRepo(type);
    return repo.findByWarehouseId(warehouseId);
  }

  async addSubItem(warehouseId, type, data) {
    const repo = this._getSubRepo(type);
    return repo.create({ ...data, warehouseId });
  }

  async updateSubItem(type, id, data) {
    const repo = this._getSubRepo(type);
    const item = await repo.update(id, data);
    if (!item) {
      const error = new Error('Item not found');
      error.statusCode = 404;
      throw error;
    }
    return item;
  }

  async deleteSubItem(type, id) {
    const repo = this._getSubRepo(type);
    const item = await repo.delete(id);
    if (!item) {
      const error = new Error('Item not found');
      error.statusCode = 404;
      throw error;
    }
    return item;
  }
}

module.exports = new WarehouseService();
