const BaseRepository = require('./BaseRepository');
const { Material } = require('../models');

class MaterialRepository extends BaseRepository {
  constructor() {
    super(Material);
  }
}

module.exports = new MaterialRepository();
