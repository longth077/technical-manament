const { Router } = require('express');
const excelController = require('../controllers/ExcelController');
const { requireAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = Router();

router.use(requireAuth);

// Main resource export/import
router.get('/:resource/export', excelController.exportResource);
router.post('/:resource/import', upload.single('file'), excelController.importResource);

// Warehouse sub-table export/import
router.get('/warehouses/:warehouseId/:type/export', excelController.exportWarehouseSub);
router.post('/warehouses/:warehouseId/:type/import', upload.single('file'), excelController.importWarehouseSub);

module.exports = router;
