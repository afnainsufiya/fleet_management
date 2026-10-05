const pool = require('../db/database');

const getAllTrips = async () => {
  const query = `
    SELECT
      t.id,
      t.vehicle_id,
      v.vehicle_number,
      t.driver_id,
      d.name AS driver_name,
      t.start_location,
      t.end_location,
      t.start_time,
      t.end_time,
      t.start_odometer,
      t.end_odometer,
      t.distance,
      t.status,
      t.created_at
    FROM trips t

    JOIN vehicles v
      ON t.vehicle_id = v.id

    JOIN drivers d
      ON t.driver_id = d.id

    ORDER BY t.id DESC;
  `;

  const result = await pool.query(query);

  return result.rows;
};

const getTripById = async (id) => {
  const query = `
    SELECT
      t.id,
      t.vehicle_id,
      v.vehicle_number,
      t.driver_id,
      d.name AS driver_name,
      t.start_location,
      t.end_location,
      t.start_time,
      t.end_time,
      t.start_odometer,
      t.end_odometer,
      t.distance,
      t.status,
      t.created_at
    FROM trips t

    JOIN vehicles v
      ON t.vehicle_id = v.id

    JOIN drivers d
      ON t.driver_id = d.id

    WHERE t.id = $1;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};

const createTrip = async ({
  vehicle_id,
  driver_id,
  start_location,
  end_location,
  start_time,
  end_time,
  start_odometer,
  end_odometer,
  distance,
  status,
}) => {
  const query = `
    INSERT INTO trips
    (
      vehicle_id,
      driver_id,
      start_location,
      end_location,
      start_time,
      end_time,
      start_odometer,
      end_odometer,
      distance,
      status
    )
    VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
  `;

  const values = [
    vehicle_id,
    driver_id,
    start_location,
    end_location,
    start_time,
    end_time,
    start_odometer,
    end_odometer,
    distance,
    status || 'SCHEDULED',
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const updateTrip = async (
  id,
  {
    vehicle_id,
    driver_id,
    start_location,
    end_location,
    start_time,
    end_time,
    start_odometer,
    end_odometer,
    distance,
    status,
  }
) => {
  const query = `
    UPDATE trips
    SET
      vehicle_id = $1,
      driver_id = $2,
      start_location = $3,
      end_location = $4,
      start_time = $5,
      end_time = $6,
      start_odometer = $7,
      end_odometer = $8,
      distance = $9,
      status = $10
    WHERE id = $11
    RETURNING *;
  `;

  const values = [
    vehicle_id,
    driver_id,
    start_location,
    end_location,
    start_time,
    end_time,
    start_odometer,
    end_odometer,
    distance,
    status,
    id,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const deleteTrip = async (id) => {
  const query = `
    DELETE FROM trips
    WHERE id = $1
    RETURNING *;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};

module.exports = {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
};