const weaponRepository = require('../repositories/WeaponRepository');

class WeaponService {
  async getAll() {
    return weaponRepository.findAll();
  }

  async getById(id) {
    const weapon = await weaponRepository.findById(id);
    if (!weapon) {
      const error = new Error('Weapon not found');
      error.statusCode = 404;
      throw error;
    }
    return weapon;
  }

  async create(data) {
    return weaponRepository.create(data);
  }

  async update(id, data) {
    const weapon = await weaponRepository.update(id, data);
    if (!weapon) {
      const error = new Error('Weapon not found');
      error.statusCode = 404;
      throw error;
    }
    return weapon;
  }

  async delete(id) {
    const weapon = await weaponRepository.delete(id);
    if (!weapon) {
      const error = new Error('Weapon not found');
      error.statusCode = 404;
      throw error;
    }
    return weapon;
  }
}

module.exports = new WeaponService();
