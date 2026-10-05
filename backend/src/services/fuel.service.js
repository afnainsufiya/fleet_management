const pool = require('../db/database');

const getAllFuelRecords = async () => {
  const query = `
    SELECT
      f.id,
      f.vehicle_id,
      v.vehicle_number,
      f.fuel_type,
      f.quantity,
      f.price_per_litre,
      f.total_cost,
      f.odometer,
      f.fuel_date
    FROM fuel_records f
    JOIN vehicles v
      ON f.vehicle_id = v.id
    ORDER BY f.id DESC;
  `;

  const result = await pool.query(query);

  return result.rows;
};

const getFuelRecordById = async (id) => {
  const query = `
    SELECT
      f.id,
      f.vehicle_id,
      v.vehicle_number,
      f.fuel_type,
      f.quantity,
      f.price_per_litre,
      f.total_cost,
      f.odometer,
      f.fuel_date
    FROM fuel_records f
    JOIN vehicles v
      ON f.vehicle_id = v.id
    WHERE f.id = $1;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};

const createFuelRecord = async ({
  vehicle_id,
  fuel_type,
  quantity,
  price_per_litre,
  total_cost,
  odometer,
  fuel_date,
}) => {
  const query = `
    INSERT INTO fuel_records
    (
      vehicle_id,
      fuel_type,
      quantity,
      price_per_litre,
      total_cost,
      odometer,
      fuel_date
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  const values = [
    vehicle_id,
    fuel_type,
    quantity,
    price_per_litre,
    total_cost,
    odometer,
    fuel_date,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const updateFuelRecord = async (
  id,
  {
    vehicle_id,
    fuel_type,
    quantity,
    price_per_litre,
    total_cost,
    odometer,
    fuel_date,
  }
) => {
  const query = `
    UPDATE fuel_records
    SET
      vehicle_id = $1,
      fuel_type = $2,
      quantity = $3,
      price_per_litre = $4,
      total_cost = $5,
      odometer = $6,
      fuel_date = $7
    WHERE id = $8
    RETURNING *;
  `;

  const values = [
    vehicle_id,
    fuel_type,
    quantity,
    price_per_litre,
    total_cost,
    odometer,
    fuel_date,
    id,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const deleteFuelRecord = async (id) => {
  const query = `
    DELETE FROM fuel_records
    WHERE id = $1
    RETURNING *;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};

module.exports = {
  getAllFuelRecords,
  getFuelRecordById,
  createFuelRecord,
  updateFuelRecord,
  deleteFuelRecord,
};