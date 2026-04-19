const unitInfoRepository = require('../repositories/UnitInfoRepository');

class UnitInfoService {
  async get() {
    return unitInfoRepository.get();
  }

  async save(data) {
    return unitInfoRepository.save(data);
  }
}

module.exports = new UnitInfoService();
