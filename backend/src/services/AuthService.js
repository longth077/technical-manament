const bcrypt = require('bcrypt');
const userRepository = require('../repositories/UserRepository');
const { User } = require('../models');

class AuthService {
  async signup({ username, email, password, fullName }) {
    const existing = await userRepository.findByUsernameOrEmail(username, email);
    if (existing) {
      const error = new Error('Username or email already exists');
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.create({
      username,
      email,
      password: hashedPassword,
      fullName,
    });

    const { password: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  async signin(username, password) {
    const user = await userRepository.findByUsername(username);
    if (!user) {
      const error = new Error('Invalid username or password');
      error.statusCode = 401;
      throw error;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      const error = new Error('Invalid username or password');
      error.statusCode = 401;
      throw error;
    }

    const { password: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  async getProfile(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }
}

module.exports = new AuthService();
