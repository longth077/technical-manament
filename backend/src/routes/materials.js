const { Router } = require('express');
const materialController = require('../controllers/MaterialController');
const { requireAuth } = require('../middleware/auth');
const { idParam } = require('../validators/commonValidator');
const validate = require('../validators/validate');

const router = Router();

router.use(requireAuth);

router.get('/', materialController.getAll);
router.get('/:id', idParam, validate, materialController.getById);
router.post('/', materialController.create);
router.put('/:id', idParam, validate, materialController.update);
router.delete('/:id', idParam, validate, materialController.delete);

module.exports = router;
