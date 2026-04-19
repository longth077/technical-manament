const { Router } = require('express');
const warehouseController = require('../controllers/WarehouseController');
const { requireAuth } = require('../middleware/auth');
const { idParam } = require('../validators/commonValidator');
const validate = require('../validators/validate');

const router = Router();

router.use(requireAuth);

router.get('/', warehouseController.getAll);
router.get('/:id', idParam, validate, warehouseController.getById);
router.post('/', warehouseController.create);
router.put('/:id', idParam, validate, warehouseController.update);
router.delete('/:id', idParam, validate, warehouseController.delete);

const SUB_TYPES = ['equipment', 'inspections', 'access', 'handover', 'exports', 'imports', 'lightning'];

SUB_TYPES.forEach((type) => {
  router.get(`/:warehouseId/${type}`, (req, res, next) => {
    req.params.type = type;
    warehouseController.getSubItems(req, res, next);
  });

  router.post(`/:warehouseId/${type}`, (req, res, next) => {
    req.params.type = type;
    warehouseController.addSubItem(req, res, next);
  });

  router.put(`/:warehouseId/${type}/:id`, (req, res, next) => {
    req.params.type = type;
    warehouseController.updateSubItem(req, res, next);
  });

  router.delete(`/:warehouseId/${type}/:id`, (req, res, next) => {
    req.params.type = type;
    warehouseController.deleteSubItem(req, res, next);
  });
});

module.exports = router;
