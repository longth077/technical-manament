const { Router } = require('express');

const authRoutes = require('./auth');
const unitInfoRoutes = require('./unitInfo');
const overviewRoutes = require('./overview');
const staffRoutes = require('./staff');
const warehouseRoutes = require('./warehouses');
const weaponRoutes = require('./weapons');
const techEquipmentRoutes = require('./techEquipment');
const vehicleRoutes = require('./vehicles');
const materialRoutes = require('./materials');

const router = Router();

router.use('/auth', authRoutes);
router.use('/unit-info', unitInfoRoutes);
router.use('/overview', overviewRoutes);
router.use('/staff', staffRoutes);
router.use('/warehouses', warehouseRoutes);
router.use('/weapons', weaponRoutes);
router.use('/tech-equipment', techEquipmentRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/materials', materialRoutes);

module.exports = router;
