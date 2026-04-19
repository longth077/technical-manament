class AdminService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async listUsers() {
    const users = await this.userRepository.findAllNonAdmin();
    return users.map((u) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      fullName: u.full_name,
      role: u.role,
      status: u.status,
      createdAt: u.created_at,
    }));
  }

  async listPendingUsers() {
    const users = await this.userRepository.findPending();
    return users.map((u) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      fullName: u.full_name,
      role: u.role,
      status: u.status,
    }));
  }

  async approveUser(id) {
    const user = await this.userRepository.updateById(id, { status: 'approved' });
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      throw err;
    }
    return user;
  }

  async updateRole(id, role) {
    const user = await this.userRepository.updateById(id, { role });
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      throw err;
    }
    return user;
  }

  async deleteUser(id) {
    const ok = await this.userRepository.deleteById(id);
    if (!ok) {
      const err = new Error('User not found');
      err.status = 404;
      throw err;
    }
  }
}

module.exports = AdminService;
