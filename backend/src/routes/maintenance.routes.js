const express = require('express');

const maintenanceController = require(
  '../controllers/maintenance.controller'
);

const router = express.Router();

router.get('/', maintenanceController.getAllMaintenance);

router.post('/', maintenanceController.createMaintenance);

router.get('/:id', maintenanceController.getMaintenanceById);

router.put('/:id', maintenanceController.updateMaintenance);

router.delete('/:id', maintenanceController.deleteMaintenance);

module.exports = router;