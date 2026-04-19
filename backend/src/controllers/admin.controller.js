class AdminController {
  constructor(adminService, dataTransferService) {
    this.adminService = adminService;
    this.dataTransferService = dataTransferService;
  }

  getUsers = async (_req, res, next) => {
    try {
      const users = await this.adminService.listUsers();
      res.json({ users });
    } catch (error) {
      next(error);
    }
  };

  getPendingUsers = async (_req, res, next) => {
    try {
      const users = await this.adminService.listPendingUsers();
      res.json({ users });
    } catch (error) {
      next(error);
    }
  };

  approveUser = async (req, res, next) => {
    try {
      await this.adminService.approveUser(req.params.userId);
      res.json({ message: 'User approved' });
    } catch (error) {
      next(error);
    }
  };

  updateRole = async (req, res, next) => {
    try {
      await this.adminService.updateRole(req.params.userId, req.body.role);
      res.json({ message: 'Role updated' });
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req, res, next) => {
    try {
      await this.adminService.deleteUser(req.params.userId);
      res.json({ message: 'User deleted' });
    } catch (error) {
      next(error);
    }
  };

  exportSql = async (_req, res, next) => {
    try {
      const sql = await this.dataTransferService.exportSql();
      res.setHeader('Content-Type', 'application/sql');
      res.setHeader('Content-Disposition', 'attachment; filename="technical-management.sql"');
      res.send(sql);
    } catch (error) {
      next(error);
    }
  };

  exportExcel = async (_req, res, next) => {
    try {
      const buffer = await this.dataTransferService.exportExcel();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="technical-management.xlsx"');
      res.send(Buffer.from(buffer));
    } catch (error) {
      next(error);
    }
  };

  importSql = async (req, res, next) => {
    try {
      await this.dataTransferService.importSql(req.body.sql || '');
      res.json({ message: 'SQL imported' });
    } catch (error) {
      next(error);
    }
  };

  importExcel = async (req, res, next) => {
    try {
      await this.dataTransferService.importExcel(req.body.base64 || '');
      res.json({ message: 'Excel imported' });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = AdminController;
