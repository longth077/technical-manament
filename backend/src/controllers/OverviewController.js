const overviewService = require('../services/OverviewService');

class OverviewController {
  async get(req, res, next) {
    try {
      const data = await overviewService.get();
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  async save(req, res, next) {
    try {
      const data = await overviewService.save(req.body);
      res.json({ message: 'Overview saved successfully', data });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OverviewController();
