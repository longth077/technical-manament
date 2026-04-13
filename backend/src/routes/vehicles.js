const { Router } = require('express');
const vehicleController = require('../controllers/VehicleController');
const { requireAuth } = require('../middleware/auth');
const { idParam } = require('../validators/commonValidator');
const validate = require('../validators/validate');

const router = Router();

router.use(requireAuth);

router.get('/', vehicleController.getAll);
router.get('/:id', idParam, validate, vehicleController.getById);
router.post('/', vehicleController.create);
router.put('/:id', idParam, validate, vehicleController.update);
router.delete('/:id', idParam, validate, vehicleController.delete);

module.exports = router;
