const express = require('express');

const vehicleController = require('../controllers/vehicle.controller');
const { validateCreateVehicle } = require('../middleware/validation');

const router = express.Router();

router.get('/vehicles', vehicleController.getAllVehicles);
router.post('/vehicles', validateCreateVehicle,vehicleController.createVehicle);
router.get('/vehicles/:id', vehicleController.getVehicleById);
router.put('/vehicles/:id', vehicleController.updateVehicle);
router.delete('/vehicles/:id', vehicleController.deleteVehicle);
module.exports = router;