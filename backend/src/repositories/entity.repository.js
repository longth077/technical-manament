const BaseRepository = require("./base.repository");

class EntityRepository extends BaseRepository {
  async findWithFilter(filter = {}) {
    return this.findAll(filter);
  }

  async findWithFilterPaginated(filter = {}, { page, limit, offset }) {
    const { count, rows } = await this.model.findAndCountAll({
      where: filter,
      order: [['id', 'ASC']],
      limit,
      offset,
    });
    return { rows, total: count, page, limit };
  }

  async replaceAll(rows, transaction) {
    await this.model.destroy({
      where: {},
      truncate: true,
      transaction,
      force: true,
    });
    if (!rows.length) return [];
    return this.model.bulkCreate(rows, { transaction });
  }
}

module.exports = EntityRepository;
