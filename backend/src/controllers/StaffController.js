const staffService = require('../services/StaffService');

class StaffController {
  async getAll(req, res, next) {
    try {
      const data = await staffService.getAll();
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await staffService.getById(req.params.id);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const data = await staffService.create(req.body);
      res.status(201).json({ message: 'Staff created successfully', data });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const data = await staffService.update(req.params.id, req.body);
      res.json({ message: 'Staff updated successfully', data });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await staffService.delete(req.params.id);
      res.json({ message: 'Staff deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StaffController();
