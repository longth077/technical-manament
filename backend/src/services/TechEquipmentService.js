const techEquipmentRepository = require('../repositories/TechEquipmentRepository');

class TechEquipmentService {
  async getAll() {
    return techEquipmentRepository.findAll();
  }

  async getById(id) {
    const item = await techEquipmentRepository.findById(id);
    if (!item) {
      const error = new Error('Technical equipment not found');
      error.statusCode = 404;
      throw error;
    }
    return item;
  }

  async create(data) {
    return techEquipmentRepository.create(data);
  }

  async update(id, data) {
    const item = await techEquipmentRepository.update(id, data);
    if (!item) {
      const error = new Error('Technical equipment not found');
      error.statusCode = 404;
      throw error;
    }
    return item;
  }

  async delete(id) {
    const item = await techEquipmentRepository.delete(id);
    if (!item) {
      const error = new Error('Technical equipment not found');
      error.statusCode = 404;
      throw error;
    }
    return item;
  }
}

module.exports = new TechEquipmentService();
