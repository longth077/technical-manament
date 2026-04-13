const BaseRepository = require('./BaseRepository');
const { Weapon } = require('../models');

class WeaponRepository extends BaseRepository {
  constructor() {
    super(Weapon);
  }
}

module.exports = new WeaponRepository();
