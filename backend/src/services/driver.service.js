const pool = require('../db/database');

const getAllDrivers = async () => {
  const query = `
    SELECT
      id,
      name,
      phone,
      license_number,
      license_expiry,
      status,
      created_at
    FROM drivers
    ORDER BY id;
  `;

  const result = await pool.query(query);

  return result.rows;
};

const getDriverById = async (id) => {
  const query = `
    SELECT
      id,
      name,
      phone,
      license_number,
      license_expiry,
      status,
      created_at
    FROM drivers
    WHERE id = $1;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};

const createDriver = async ({
  name,
  phone,
  license_number,
  license_expiry,
}) => {
  const query = `
    INSERT INTO drivers
    (
      name,
      phone,
      license_number,
      license_expiry
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [
    name,
    phone,
    license_number,
    license_expiry,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const updateDriver = async (
  id,
  {
    name,
    phone,
    license_number,
    license_expiry,
    status,
  }
) => {
  const query = `
    UPDATE drivers
    SET
      name = $1,
      phone = $2,
      license_number = $3,
      license_expiry = $4,
      status = $5
    WHERE id = $6
    RETURNING *;
  `;

  const values = [
    name,
    phone,
    license_number,
    license_expiry,
    status,
    id,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const deleteDriver = async (id) => {
  const query = `
    DELETE FROM drivers
    WHERE id = $1
    RETURNING *;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};

module.exports = {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
};