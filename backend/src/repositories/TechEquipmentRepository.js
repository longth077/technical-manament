const BaseRepository = require('./BaseRepository');
const { TechEquipment } = require('../models');

class TechEquipmentRepository extends BaseRepository {
  constructor() {
    super(TechEquipment);
  }
}

module.exports = new TechEquipmentRepository();
