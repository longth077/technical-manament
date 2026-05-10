const express = require("express");
const { body, param } = require("express-validator");
const validate = require("../middleware/validate");
const { requireRole, requireWriteAccess } = require("../middleware/authorize");
const { signupValidator } = require("../validators/auth.validator");

function createRoutes({
  authMiddleware,
  authController,
  adminController,
  entityController,
  enumController,
}) {
  const router = express.Router();

  router.post("/auth/signup", signupValidator, validate, authController.signup);
  router.get("/auth/me", authMiddleware, authController.me);

  router.get(
    "/admin/users",
    authMiddleware,
    requireRole("admin"),
    adminController.getUsers,
  );
  router.get(
    "/admin/users/pending",
    authMiddleware,
    requireRole("admin"),
    adminController.getPendingUsers,
  );
  router.patch(
    "/admin/users/:userId/approve",
    authMiddleware,
    requireRole("admin"),
    adminController.approveUser,
  );
  router.patch(
    "/admin/users/:userId/role",
    authMiddleware,
    requireRole("admin"),
    body("role").isIn(["admin", "user", "readonly"]),
    validate,
    adminController.updateRole,
  );
  router.delete(
    "/admin/users/:userId",
    authMiddleware,
    requireRole("admin"),
    adminController.deleteUser,
  );

  router.get(
    "/admin/reports/excel",
    authMiddleware,
    requireRole("admin", "user"),
    adminController.exportAllReports,
  );

  router.get(
    "/admin/export/sql",
    authMiddleware,
    requireRole("admin"),
    adminController.exportSql,
  );
  router.get(
    "/admin/export/excel",
    authMiddleware,
    requireRole("admin"),
    adminController.exportExcel,
  );
  router.post(
    "/admin/import/sql",
    authMiddleware,
    requireRole("admin"),
    body("sql").isString(),
    validate,
    adminController.importSql,
  );
  router.post(
    "/admin/import/excel",
    authMiddleware,
    requireRole("admin"),
    body("base64").isString(),
    validate,
    adminController.importExcel,
  );
  router.get(
    "/admin/export/csv",
    authMiddleware,
    requireRole("admin"),
    adminController.exportCsv,
  );
  router.post(
    "/admin/import/csv",
    authMiddleware,
    requireRole("admin"),
    body("base64").isString(),
    validate,
    adminController.importCsv,
  );

  router.get("/entities/:entity", authMiddleware, entityController.list);
  router.post(
    "/entities/:entity",
    authMiddleware,
    requireWriteAccess,
    entityController.create,
  );
  router.put(
    "/entities/:entity/:id",
    authMiddleware,
    requireWriteAccess,
    param("id").isInt(),
    validate,
    entityController.update,
  );
  router.delete(
    "/entities/:entity/:id",
    authMiddleware,
    requireWriteAccess,
    param("id").isInt(),
    validate,
    entityController.remove,
  );
  router.get(
    "/reports/:entity/excel",
    authMiddleware,
    requireRole("admin", "user"),
    entityController.reportExcel,
  );

  // Enum / dropdown endpoints
  router.get("/enums", authMiddleware, enumController.listTypes);
  router.get("/enums/:type", authMiddleware, enumController.listByType);
  router.post(
    "/enums/:type",
    authMiddleware,
    requireWriteAccess,
    body("enum").isString().notEmpty().withMessage("enum value is required"),
    validate,
    enumController.addValue,
  );
  router.delete(
    "/enums/:type/:id",
    authMiddleware,
    requireRole("admin", "user"),
    param("id").isInt(),
    validate,
    enumController.deleteValue,
  );

  return router;
}

module.exports = createRoutes;
