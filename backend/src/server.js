
const app = require('./app');
const pool = require('./db/database');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

pool.query('SELECT NOW()', (error, result) => {
  if (error) {
    console.error('Database connection failed:', error);
  } else {
    console.log('Database connected:', result.rows[0]);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});