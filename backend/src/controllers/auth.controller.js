const authService = require('../services/auth.service');


// Register
const register = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      role,
    } = req.body;


    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required',
      });
    }


    const user = await authService.registerUser({
      name,
      email,
      password,
      role,
    });


    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    });

  } catch (error) {

    console.error('Register error:', error);


    if (error.message === 'EMAIL_ALREADY_EXISTS') {
      return res.status(409).json({
        success: false,
        message: 'Email already exists',
      });
    }


    res.status(500).json({
      success: false,
      message: 'Failed to register user',
    });
  }
};


// Login
const login = async (req, res) => {
  try {

    const {
      email,
      password,
    } = req.body;


    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }


    const result = await authService.loginUser({
      email,
      password,
    });


    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });

  } catch (error) {

    console.error('Login error:', error);


    if (error.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }


    if (error.message === 'USER_INACTIVE') {
      return res.status(403).json({
        success: false,
        message: 'User account is inactive',
      });
    }


    res.status(500).json({
      success: false,
      message: 'Failed to login',
    });
  }
};


module.exports = {
  register,
  login,
};