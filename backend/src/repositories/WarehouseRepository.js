const BaseRepository = require('./BaseRepository');
const { Warehouse } = require('../models');

class WarehouseRepository extends BaseRepository {
  constructor() {
    super(Warehouse);
  }

  async findWithDetails(id) {
    return Warehouse.findByPk(id, {
      include: [
        { association: 'equipment' },
        { association: 'inspections' },
        { association: 'access' },
        { association: 'handover' },
        { association: 'exports' },
        { association: 'imports' },
        { association: 'lightning' },
      ],
    });
  }
}

module.exports = new WarehouseRepository();
