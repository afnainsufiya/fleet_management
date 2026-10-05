const express = require('express');

const tripController = require('../controllers/trip.controller');

const router = express.Router();

router.get('/', tripController.getAllTrips);

router.post('/', tripController.createTrip);

router.get('/:id', tripController.getTripById);

router.put('/:id', tripController.updateTrip);

router.delete('/:id', tripController.deleteTrip);

module.exports = router;