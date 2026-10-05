const express = require('express');

const fuelController = require('../controllers/fuel.controller');

const router = express.Router();

router.get('/', fuelController.getAllFuelRecords);

router.post('/', fuelController.createFuelRecord);

router.get('/:id', fuelController.getFuelRecordById);

router.put('/:id', fuelController.updateFuelRecord);

router.delete('/:id', fuelController.deleteFuelRecord);

module.exports = router;