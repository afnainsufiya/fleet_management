const express = require('express');

const driverController = require('../controllers/driver.controller');

const router = express.Router();

router.get('/drivers', driverController.getAllDrivers);

router.post('/drivers', driverController.createDriver);

router.get('/drivers/:id', driverController.getDriverById);

router.put('/drivers/:id', driverController.updateDriver);

router.delete('/drivers/:id', driverController.deleteDriver);

module.exports = router;