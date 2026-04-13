const BaseRepository = require('./BaseRepository');
const { User } = require('../models');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByUsername(username) {
    return User.scope('withPassword').findOne({ where: { username } });
  }

  async findByUsernameOrEmail(username, email) {
    const { Op } = require('sequelize');
    return User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });
  }
}

module.exports = new UserRepository();
