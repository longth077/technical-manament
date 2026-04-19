const { Router } = require('express');
const techEquipmentController = require('../controllers/TechEquipmentController');
const { requireAuth } = require('../middleware/auth');
const { idParam } = require('../validators/commonValidator');
const validate = require('../validators/validate');

const router = Router();

router.use(requireAuth);

router.get('/', techEquipmentController.getAll);
router.get('/:id', idParam, validate, techEquipmentController.getById);
router.post('/', techEquipmentController.create);
router.put('/:id', idParam, validate, techEquipmentController.update);
router.delete('/:id', idParam, validate, techEquipmentController.delete);

module.exports = router;
