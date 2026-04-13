const staffRepository = require('../repositories/StaffRepository');

class StaffService {
  async getAll() {
    return staffRepository.findAll();
  }

  async getById(id) {
    const staff = await staffRepository.findById(id);
    if (!staff) {
      const error = new Error('Staff not found');
      error.statusCode = 404;
      throw error;
    }
    return staff;
  }

  async create(data) {
    return staffRepository.create(data);
  }

  async update(id, data) {
    const staff = await staffRepository.update(id, data);
    if (!staff) {
      const error = new Error('Staff not found');
      error.statusCode = 404;
      throw error;
    }
    return staff;
  }

  async delete(id) {
    const staff = await staffRepository.delete(id);
    if (!staff) {
      const error = new Error('Staff not found');
      error.statusCode = 404;
      throw error;
    }
    return staff;
  }
}

module.exports = new StaffService();
