class WarehouseSubRepository {
  constructor(model) {
    this.model = model;
  }

  async findByWarehouseId(warehouseId) {
    return this.model.findAll({ where: { warehouseId } });
  }

  async findById(id) {
    return this.model.findByPk(id);
  }

  async create(data) {
    return this.model.create(data);
  }

  async update(id, data) {
    const record = await this.model.findByPk(id);
    if (!record) return null;
    return record.update(data);
  }

  async delete(id) {
    const record = await this.model.findByPk(id);
    if (!record) return null;
    await record.destroy();
    return record;
  }
}

module.exports = WarehouseSubRepository;
