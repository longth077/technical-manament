const { Router } = require('express');
const unitInfoController = require('../controllers/UnitInfoController');
const { requireAuth } = require('../middleware/auth');

const router = Router();

router.get('/', requireAuth, unitInfoController.get);
router.put('/', requireAuth, unitInfoController.save);

module.exports = router;
