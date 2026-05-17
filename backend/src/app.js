const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const { sequelize, models } = require("./models");
const UserRepository = require("./repositories/user.repository");
const EntityRepository = require("./repositories/entity.repository");
const AuthService = require("./services/auth.service");
const AdminService = require("./services/admin.service");
const EntityService = require("./services/entity.service");
const EnumService = require("./services/enum.service");
const DataTransferService = require("./services/data-transfer.service");
const ReportService = require("./services/report.service");
const AuthController = require("./controllers/auth.controller");
const AdminController = require("./controllers/admin.controller");
const EntityController = require("./controllers/entity.controller");
const EnumController = require("./controllers/enum.controller");
const WarehouseImageController = require("./controllers/warehouse-image.controller");
const authMiddlewareFactory = require("./middleware/basic-auth");
const errorHandler = require("./middleware/error-handler");
const createRoutes = require("./routes");
const { ENTITY_NAMES } = require("./utils/entities");

// ── Warehouse image upload directory (absolute path at project root) ──────────
const WAREHOUSE_IMAGES_DIR = path.resolve(__dirname, "../../warehouse_images");
if (!fs.existsSync(WAREHOUSE_IMAGES_DIR)) {
  fs.mkdirSync(WAREHOUSE_IMAGES_DIR, { recursive: true });
}

const multerStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, WAREHOUSE_IMAGES_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const warehouseImageUpload = multer({
  storage: multerStorage,
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Chỉ chấp nhận file ảnh (jpeg, png, gif, webp)"));
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

async function createApp() {
  await sequelize.authenticate();
  await sequelize.sync();

  const userRepository = new UserRepository(models.users);
  const entityRepositories = Object.fromEntries(
    ENTITY_NAMES.map((name) => [name, new EntityRepository(models[name])]),
  );

  const authService = new AuthService(userRepository);
  await authService.ensureDefaultAdmin();

  const adminService = new AdminService(userRepository);
  const entityService = new EntityService(entityRepositories);
  const enumService = new EnumService(models.enum_constants);
  const dataTransferService = new DataTransferService(models);
  const reportService = new ReportService(models);

  const authController = new AuthController(authService);
  const adminController = new AdminController(
    adminService,
    dataTransferService,
    reportService,
  );
  const entityController = new EntityController(
    entityService,
    dataTransferService,
    reportService,
  );
  const enumController = new EnumController(enumService);
  const warehouseImageController = new WarehouseImageController(
    models.warehouse_images,
    models.enum_constants,
  );

  const authMiddleware = authMiddlewareFactory(authService);

  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "20mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Serve uploaded warehouse images as static files
  app.use("/uploads/warehouse_images", express.static(WAREHOUSE_IMAGES_DIR));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  const apiRouter = createRoutes({
    authMiddleware,
    authController,
    adminController,
    entityController,
    enumController,
    warehouseImageController,
    warehouseImageUpload,
  });
  app.use("/api", apiRouter);

  app.use(errorHandler);

  return app;
}

module.exports = createApp;
