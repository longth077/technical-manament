const BaseRepository = require('./BaseRepository');
const { Staff } = require('../models');

class StaffRepository extends BaseRepository {
  constructor() {
    super(Staff);
  }
}

module.exports = new StaffRepository();
