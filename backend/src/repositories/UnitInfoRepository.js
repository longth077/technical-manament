const { UnitInfo } = require('../models');

class UnitInfoRepository {
  async get() {
    return UnitInfo.findByPk(1);
  }

  async save(data) {
    const existing = await UnitInfo.findByPk(1);
    if (existing) {
      return existing.update(data);
    }
    return UnitInfo.create({ ...data, id: 1 });
  }
}

module.exports = new UnitInfoRepository();
