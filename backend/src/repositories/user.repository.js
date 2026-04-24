const { Op } = require('sequelize');

class UserRepository {
  constructor(model) {
    this.model = model;
  }

  async findByUsername(username) {
    return this.model.findOne({ where: { username } });
  }

  async findByEmail(email) {
    return this.model.findOne({ where: { email } });
  }

  async findByCredential(usernameOrEmail) {
    return this.model.findOne({
      where: {
        [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });
  }

  async findPending() {
    return this.model.findAll({ where: { status: 'pending' }, order: [['created_at', 'ASC']] });
  }

  async findAllNonAdmin() {
    return this.model.findAll({ order: [['id', 'ASC']] });
  }

  async create(payload) {
    return this.model.create(payload);
  }

  async updateById(id, payload) {
    const user = await this.model.findByPk(id);
    if (!user) return null;
    await user.update(payload);
    return user;
  }

  async deleteById(id) {
    const user = await this.model.findByPk(id);
    if (!user) return false;
    await user.destroy();
    return true;
  }
}

module.exports = UserRepository;
