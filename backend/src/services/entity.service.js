class EntityService {
  constructor(entityRepositories) {
    this.entityRepositories = entityRepositories;
  }

  getRepository(name) {
    const repo = this.entityRepositories[name];
    if (!repo) {
      const err = new Error('Invalid entity');
      err.status = 404;
      throw err;
    }
    return repo;
  }

  async list(entity, query = {}) {
    const repo = this.getRepository(entity);
    const where = {};
    if (query.warehouse_id) where.warehouse_id = query.warehouse_id;
    return repo.findWithFilter(where);
  }

  async create(entity, payload) {
    const repo = this.getRepository(entity);
    return repo.create(payload);
  }

  async update(entity, id, payload) {
    const repo = this.getRepository(entity);
    const row = await repo.update(id, payload);
    if (!row) {
      const err = new Error('Record not found');
      err.status = 404;
      throw err;
    }
    return row;
  }

  async remove(entity, id) {
    const repo = this.getRepository(entity);
    const ok = await repo.delete(id);
    if (!ok) {
      const err = new Error('Record not found');
      err.status = 404;
      throw err;
    }
  }
}

module.exports = EntityService;
