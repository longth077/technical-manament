const materialRepository = require('../repositories/MaterialRepository');

class MaterialService {
  async getAll() {
    return materialRepository.findAll();
  }

  async getById(id) {
    const material = await materialRepository.findById(id);
    if (!material) {
      const error = new Error('Material not found');
      error.statusCode = 404;
      throw error;
    }
    return material;
  }

  async create(data) {
    return materialRepository.create(data);
  }

  async update(id, data) {
    const material = await materialRepository.update(id, data);
    if (!material) {
      const error = new Error('Material not found');
      error.statusCode = 404;
      throw error;
    }
    return material;
  }

  async delete(id) {
    const material = await materialRepository.delete(id);
    if (!material) {
      const error = new Error('Material not found');
      error.statusCode = 404;
      throw error;
    }
    return material;
  }
}

module.exports = new MaterialService();
