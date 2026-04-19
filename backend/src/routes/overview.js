const { Router } = require('express');
const overviewController = require('../controllers/OverviewController');
const { requireAuth } = require('../middleware/auth');

const router = Router();

router.get('/', requireAuth, overviewController.get);
router.put('/', requireAuth, overviewController.save);

module.exports = router;
