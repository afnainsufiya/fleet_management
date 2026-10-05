const pool = require('../db/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Register user
const registerUser = async ({
  name,
  email,
  password,
  role,
}) => {

  // Check whether email already exists
  const existingUserQuery = `
    SELECT id
    FROM users
    WHERE email = $1;
  `;

  const existingUser = await pool.query(
    existingUserQuery,
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new Error('EMAIL_ALREADY_EXISTS');
  }


  // Hash password
  const passwordHash = await bcrypt.hash(
    password,
    10
  );


  // Insert user
  const query = `
    INSERT INTO users
    (
      name,
      email,
      password_hash,
      role
    )
    VALUES ($1, $2, $3, $4)
    RETURNING
      id,
      name,
      email,
      role,
      status,
      created_at;
  `;

  const values = [
    name,
    email,
    passwordHash,
    role || 'MANAGER',
  ];

  const result = await pool.query(
    query,
    values
  );

  return result.rows[0];
};


// Login user
const loginUser = async ({
  email,
  password,
}) => {

  // Find user
  const query = `
    SELECT *
    FROM users
    WHERE email = $1;
  `;

  const result = await pool.query(
    query,
    [email]
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }


  // Check status
  if (user.status !== 'ACTIVE') {
    throw new Error('USER_INACTIVE');
  }


  // Compare password
  const passwordMatch = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!passwordMatch) {
    throw new Error('INVALID_CREDENTIALS');
  }


  // Create JWT
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    }
  );


  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  };
};


module.exports = {
  registerUser,
  loginUser,
};