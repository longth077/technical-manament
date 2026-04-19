const BaseRepository = require('./BaseRepository');
const { Vehicle } = require('../models');

class VehicleRepository extends BaseRepository {
  constructor() {
    super(Vehicle);
  }
}

module.exports = new VehicleRepository();
