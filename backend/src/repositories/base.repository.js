class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll(where = {}) {
    return this.model.findAll({ where, order: [['id', 'ASC']] });
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
