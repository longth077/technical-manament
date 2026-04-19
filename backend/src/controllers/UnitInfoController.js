const unitInfoService = require('../services/UnitInfoService');

class UnitInfoController {
  async get(req, res, next) {
    try {
      const data = await unitInfoService.get();
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  async save(req, res, next) {
    try {
      const data = await unitInfoService.save(req.body);
      res.json({ message: 'Unit info saved successfully', data });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UnitInfoController();
