class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll(where = {}) {
    return this.model.findAll({ where, order: [["id", "ASC"]] });
  }

  async findPaginated(where = {}, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const { count, rows } = await this.model.findAndCountAll({
      where,
      order: [["id", "ASC"]],
      limit: +limit,
      offset: +offset,
    });
    return {
      rows,
      total: count,
      page: +page,
      limit: +limit,
      pages: Math.ceil(count / limit) || 1,
    };
  }

  async findById(id) {
    return this.model.findByPk(id);
  }

  async create(payload) {
    return this.model.create(payload);
  }

  async update(id, payload) {
    const row = await this.findById(id);
    if (!row) return null;
    await row.update(payload);
    return row;
  }

  async delete(id) {
    const row = await this.findById(id);
    if (!row) return false;
    await row.destroy();
    return true;
  }
}

module.exports = BaseRepository;
