const vehicleService = require('../services/VehicleService');

class VehicleController {
  async getAll(req, res, next) {
    try {
      const data = await vehicleService.getAll();
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await vehicleService.getById(req.params.id);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const data = await vehicleService.create(req.body);
      res.status(201).json({ message: 'Vehicle created successfully', data });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const data = await vehicleService.update(req.params.id, req.body);
      res.json({ message: 'Vehicle updated successfully', data });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await vehicleService.delete(req.params.id);
      res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new VehicleController();
