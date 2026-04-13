const overviewRepository = require('../repositories/OverviewRepository');

class OverviewService {
  async get() {
    return overviewRepository.get();
  }

  async save(data) {
    return overviewRepository.save(data);
  }
}

module.exports = new OverviewService();
