const warehouseService = require('../services/WarehouseService');

class WarehouseController {
  async getAll(req, res, next) {
    try {
      const data = await warehouseService.getAll();
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await warehouseService.getById(req.params.id);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const data = await warehouseService.create(req.body);
      res.status(201).json({ message: 'Warehouse created successfully', data });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const data = await warehouseService.update(req.params.id, req.body);
      res.json({ message: 'Warehouse updated successfully', data });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await warehouseService.delete(req.params.id);
      res.json({ message: 'Warehouse deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getSubItems(req, res, next) {
    try {
      const { warehouseId, type } = req.params;
      const data = await warehouseService.getSubItems(warehouseId, type);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  async addSubItem(req, res, next) {
    try {
      const { warehouseId, type } = req.params;
      const data = await warehouseService.addSubItem(warehouseId, type, req.body);
      res.status(201).json({ message: 'Item added successfully', data });
    } catch (error) {
      next(error);
    }
  }

  async updateSubItem(req, res, next) {
    try {
      const { type, id } = req.params;
      const data = await warehouseService.updateSubItem(type, id, req.body);
      res.json({ message: 'Item updated successfully', data });
    } catch (error) {
      next(error);
    }
  }

  async deleteSubItem(req, res, next) {
    try {
      const { type, id } = req.params;
      await warehouseService.deleteSubItem(type, id);
      res.json({ message: 'Item deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WarehouseController();
