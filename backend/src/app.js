const express = require('express');
const cors = require('cors');

const { sequelize, models } = require('./models');
const UserRepository = require('./repositories/user.repository');
const EntityRepository = require('./repositories/entity.repository');
const AuthService = require('./services/auth.service');
const AdminService = require('./services/admin.service');
const EntityService = require('./services/entity.service');
const DataTransferService = require('./services/data-transfer.service');
const AuthController = require('./controllers/auth.controller');
const AdminController = require('./controllers/admin.controller');
const EntityController = require('./controllers/entity.controller');
const authMiddlewareFactory = require('./middleware/basic-auth');
const errorHandler = require('./middleware/error-handler');
const createRoutes = require('./routes');
const { ENTITY_NAMES } = require('./utils/entities');

async function createApp() {
  await sequelize.authenticate();
  await sequelize.sync();

  const userRepository = new UserRepository(models.users);
  const entityRepositories = Object.fromEntries(
    ENTITY_NAMES.map((name) => [name, new EntityRepository(models[name])])
  );

  const authService = new AuthService(userRepository);
  await authService.ensureDefaultAdmin();

  const adminService = new AdminService(userRepository);
  const entityService = new EntityService(entityRepositories);
  const dataTransferService = new DataTransferService(models);

  const authController = new AuthController(authService);
  const adminController = new AdminController(adminService, dataTransferService);
  const entityController = new EntityController(entityService, dataTransferService);

  const authMiddleware = authMiddlewareFactory(authService);

  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (_req, res) => res.json({ ok: true }));

  const apiRouter = createRoutes({ authMiddleware, authController, adminController, entityController });
  app.use('/api', apiRouter);


  app.use(errorHandler);

  return app;
}

module.exports = createApp;
