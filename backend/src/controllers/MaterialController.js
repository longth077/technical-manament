const materialService = require('../services/MaterialService');

class MaterialController {
  async getAll(req, res, next) {
    try {
      const data = await materialService.getAll();
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await materialService.getById(req.params.id);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const data = await materialService.create(req.body);
      res.status(201).json({ message: 'Material created successfully', data });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const data = await materialService.update(req.params.id, req.body);
      res.json({ message: 'Material updated successfully', data });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await materialService.delete(req.params.id);
      res.json({ message: 'Material deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MaterialController();
