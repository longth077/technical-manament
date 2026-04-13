const vehicleRepository = require('../repositories/VehicleRepository');

class VehicleService {
  async getAll() {
    return vehicleRepository.findAll();
  }

  async getById(id) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      const error = new Error('Vehicle not found');
      error.statusCode = 404;
      throw error;
    }
    return vehicle;
  }

  async create(data) {
    return vehicleRepository.create(data);
  }

  async update(id, data) {
    const vehicle = await vehicleRepository.update(id, data);
    if (!vehicle) {
      const error = new Error('Vehicle not found');
      error.statusCode = 404;
      throw error;
    }
    return vehicle;
  }

  async delete(id) {
    const vehicle = await vehicleRepository.delete(id);
    if (!vehicle) {
      const error = new Error('Vehicle not found');
      error.statusCode = 404;
      throw error;
    }
    return vehicle;
  }
}

module.exports = new VehicleService();
