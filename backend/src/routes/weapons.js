const { Router } = require('express');
const weaponController = require('../controllers/WeaponController');
const { requireAuth } = require('../middleware/auth');
const { idParam } = require('../validators/commonValidator');
const validate = require('../validators/validate');

const router = Router();

router.use(requireAuth);

router.get('/', weaponController.getAll);
router.get('/:id', idParam, validate, weaponController.getById);
router.post('/', weaponController.create);
router.put('/:id', idParam, validate, weaponController.update);
router.delete('/:id', idParam, validate, weaponController.delete);

module.exports = router;
