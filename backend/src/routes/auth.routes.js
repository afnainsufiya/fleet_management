const express = require('express');

const authController =
  require('../controllers/auth.controller');

const router = express.Router();


// Register
router.post(
  '/register',
  authController.register
);


// Login
router.post(
  '/login',
  authController.login
);


module.exports = router;