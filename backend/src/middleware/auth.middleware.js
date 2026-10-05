const jwt = require('jsonwebtoken');


const authenticateToken = (req, res, next) => {

  const authHeader = req.headers.authorization;


  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Authorization header is required',
    });
  }


  const token = authHeader.split(' ')[1];


  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token is required',
    });
  }


  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );


    // Store logged-in user
    req.user = decoded;


    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};


module.exports = authenticateToken;