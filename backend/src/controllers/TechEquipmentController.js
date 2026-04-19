const techEquipmentService = require('../services/TechEquipmentService');

class TechEquipmentController {
  async getAll(req, res, next) {
    try {
      const data = await techEquipmentService.getAll();
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await techEquipmentService.getById(req.params.id);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const data = await techEquipmentService.create(req.body);
      res.status(201).json({ message: 'Technical equipment created successfully', data });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const data = await techEquipmentService.update(req.params.id, req.body);
      res.json({ message: 'Technical equipment updated successfully', data });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await techEquipmentService.delete(req.params.id);
      res.json({ message: 'Technical equipment deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TechEquipmentController();
