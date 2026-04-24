const BaseRepository = require('./base.repository');

class EntityRepository extends BaseRepository {
  async findWithFilter(filter = {}) {
    return this.findAll(filter);
  }

  async replaceAll(rows, transaction) {
    await this.model.destroy({ where: {}, truncate: true, transaction, force: true });
    if (!rows.length) return [];
    return this.model.bulkCreate(rows, { transaction });
  }
}

module.exports = EntityRepository;
