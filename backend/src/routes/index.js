const express = require('express');
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const { requireRole, requireWriteAccess } = require('../middleware/authorize');
const { signupValidator } = require('../validators/auth.validator');

function createRoutes({ authMiddleware, authController, adminController, entityController }) {
  const router = express.Router();

  router.post('/auth/signup', signupValidator, validate, authController.signup);
  router.get('/auth/me', authMiddleware, authController.me);

  router.get('/admin/users', authMiddleware, requireRole('admin'), adminController.getUsers);
  router.get('/admin/users/pending', authMiddleware, requireRole('admin'), adminController.getPendingUsers);
  router.patch('/admin/users/:userId/approve', authMiddleware, requireRole('admin'), adminController.approveUser);
  router.patch(
    '/admin/users/:userId/role',
    authMiddleware,
    requireRole('admin'),
    body('role').isIn(['admin', 'user', 'readonly']),
    validate,
    adminController.updateRole
  );
  router.delete('/admin/users/:userId', authMiddleware, requireRole('admin'), adminController.deleteUser);

  router.get('/admin/export/sql', authMiddleware, requireRole('admin'), adminController.exportSql);
  router.get('/admin/export/excel', authMiddleware, requireRole('admin'), adminController.exportExcel);
  router.post('/admin/import/sql', authMiddleware, requireRole('admin'), body('sql').isString(), validate, adminController.importSql);
  router.post('/admin/import/excel', authMiddleware, requireRole('admin'), body('base64').isString(), validate, adminController.importExcel);

  router.get('/entities/:entity', authMiddleware, entityController.list);
  router.post('/entities/:entity', authMiddleware, requireWriteAccess, entityController.create);
  router.put('/entities/:entity/:id', authMiddleware, requireWriteAccess, param('id').isInt(), validate, entityController.update);
  router.delete('/entities/:entity/:id', authMiddleware, requireWriteAccess, param('id').isInt(), validate, entityController.remove);
  router.get('/reports/:entity/excel', authMiddleware, requireRole('admin', 'user'), entityController.reportExcel);

  return router;
}

module.exports = createRoutes;
