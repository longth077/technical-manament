const { Overview } = require('../models');

class OverviewRepository {
  async get() {
    return Overview.findByPk(1);
  }

  async save(data) {
    const existing = await Overview.findByPk(1);
    if (existing) {
      return existing.update(data);
    }
    return Overview.create({ ...data, id: 1 });
  }
}

module.exports = new OverviewRepository();
