const { Router } = require('express');
const staffController = require('../controllers/StaffController');
const { requireAuth } = require('../middleware/auth');
const { idParam } = require('../validators/commonValidator');
const validate = require('../validators/validate');

const router = Router();

router.use(requireAuth);

router.get('/', staffController.getAll);
router.get('/:id', idParam, validate, staffController.getById);
router.post('/', staffController.create);
router.put('/:id', idParam, validate, staffController.update);
router.delete('/:id', idParam, validate, staffController.delete);

module.exports = router;
