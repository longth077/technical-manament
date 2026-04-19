const weaponService = require('../services/WeaponService');

class WeaponController {
  async getAll(req, res, next) {
    try {
      const data = await weaponService.getAll();
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await weaponService.getById(req.params.id);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const data = await weaponService.create(req.body);
      res.status(201).json({ message: 'Weapon created successfully', data });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const data = await weaponService.update(req.params.id, req.body);
      res.json({ message: 'Weapon updated successfully', data });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await weaponService.delete(req.params.id);
      res.json({ message: 'Weapon deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WeaponController();
