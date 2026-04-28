class EnumService {
  constructor(enumConstantsModel) {
    this.model = enumConstantsModel;
  }

  async listTypes() {
    const rows = await this.model.findAll({
      attributes: ["type"],
      group: ["type"],
      order: [["type", "ASC"]],
      raw: true,
    });
    return rows.map((r) => r.type);
  }

  async listByType(type, { page = 1, limit = 100 } = {}) {
    const offset = (page - 1) * limit;
    const { count, rows } = await this.model.findAndCountAll({
      where: { type },
      order: [["id", "ASC"]],
      limit,
      offset,
    });
    return { rows, total: count, page, limit };
  }

  async addValue(type, enumValue) {
    if (!type || String(type).trim() === "") {
      const err = new Error("type is required");
      err.status = 422;
      throw err;
    }
    if (enumValue === undefined || enumValue === null) {
      const err = new Error("enum value is required");
      err.status = 422;
      throw err;
    }

    const existing = await this.model.findOne({
      where: { type, enum: enumValue },
    });
    if (existing) {
      const err = new Error("Enum value already exists for this type");
      err.status = 409;
      throw err;
    }

    return this.model.create({ type, enum: String(enumValue) });
  }

  async deleteValue(id) {
    const row = await this.model.findByPk(id);
    if (!row) {
      const err = new Error("Enum value not found");
      err.status = 404;
      throw err;
    }
    await row.destroy();
  }
}

module.exports = EnumService;
