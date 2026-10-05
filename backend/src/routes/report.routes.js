const express = require('express');

const reportController = require('../controllers/report.controller');

const router = express.Router();

router.get(
  '/dashboard',
  reportController.getDashboardSummary
);

router.get(
  '/vehicle-expenses',
  reportController.getVehicleExpenseReport
);

router.get(
  '/fuel-summary',
  reportController.getFuelSummary
);

router.get(
  '/trip-summary',
  reportController.getTripSummary
);

router.get(
  '/monthly-expenses',
  reportController.getMonthlyExpenseReport
);

module.exports = router;