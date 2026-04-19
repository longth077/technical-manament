const bcrypt = require('bcrypt');

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async ensureDefaultAdmin() {
    const username = 'admin';
    const email = 'thanhpxd49@gmail.com';
    const password = 'dank4920132018';
    const fullName = 'Administrator';

    const existing = await this.userRepository.findByUsername(username);
    const hash = await bcrypt.hash(password, 10);

    if (!existing) {
      await this.userRepository.create({ username, email, password: hash, full_name: fullName, role: 'admin', status: 'approved' });
      return;
    }

    await existing.update({ email, password: hash, role: 'admin', status: 'approved', full_name: fullName });
  }

  async signup(payload) {
    const { username, email, password, fullName } = payload;

    const existingUsername = await this.userRepository.findByUsername(username);
    if (existingUsername) {
      const err = new Error('Username already exists');
      err.status = 409;
      throw err;
    }

    const existingEmail = await this.userRepository.findByEmail(email);
    if (existingEmail) {
      const err = new Error('Email already exists');
      err.status = 409;
      throw err;
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({
      username,
      email,
      password: hash,
      full_name: fullName,
      role: 'user',
      status: 'pending',
    });

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      status: user.status,
    };
  }

  async authenticate(basicCredential, password) {
    const user = await this.userRepository.findByCredential(basicCredential);
    if (!user) return null;
    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;
    if (user.status !== 'approved') {
      const err = new Error('Account is pending approval');
      err.status = 403;
      throw err;
    }
    return user;
  }
}

module.exports = AuthService;
