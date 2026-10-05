const express = require('express');

const driverAssignmentController =
  require('../controllers/driverAssignment.controller');

const authenticateToken =
  require('../middleware/auth.middleware');

const authorizeRoles =
  require('../middleware/role.middleware');

const router = express.Router();


// Get assignments
router.get(
  '/',
  authenticateToken,
  driverAssignmentController.getAllAssignments
);


// Create assignment
router.post(
  '/',
  authenticateToken,
  authorizeRoles('ADMIN', 'MANAGER'),
  driverAssignmentController.createAssignment
);


// Get assignment by ID
router.get(
  '/:id',
  authenticateToken,
  driverAssignmentController.getAssignmentById
);


// Update assignment
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('ADMIN', 'MANAGER'),
  driverAssignmentController.updateAssignment
);


// Delete assignment
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('ADMIN'),
  driverAssignmentController.deleteAssignment
);


module.exports = router;