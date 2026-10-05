const pool = require('../db/database');


// Get all assignments
const getAllAssignments = async () => {
  const query = `
    SELECT
      da.id,
      da.vehicle_id,
      v.vehicle_number,
      da.driver_id,
      d.name AS driver_name,
      d.phone AS driver_phone,
      da.assigned_from,
      da.assigned_to,
      da.status,
      da.created_at
    FROM driver_assignments da

    JOIN vehicles v
      ON da.vehicle_id = v.id

    JOIN drivers d
      ON da.driver_id = d.id

    ORDER BY da.id DESC;
  `;

  const result = await pool.query(query);

  return result.rows;
};


// Get assignment by ID
const getAssignmentById = async (id) => {
  const query = `
    SELECT
      da.id,
      da.vehicle_id,
      v.vehicle_number,
      da.driver_id,
      d.name AS driver_name,
      d.phone AS driver_phone,
      da.assigned_from,
      da.assigned_to,
      da.status,
      da.created_at
    FROM driver_assignments da

    JOIN vehicles v
      ON da.vehicle_id = v.id

    JOIN drivers d
      ON da.driver_id = d.id

    WHERE da.id = $1;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};


// Create assignment
const createAssignment = async ({
  vehicle_id,
  driver_id,
  assigned_from,
  assigned_to,
  status,
}) => {
  const query = `
    INSERT INTO driver_assignments
    (
      vehicle_id,
      driver_id,
      assigned_from,
      assigned_to,
      status
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const values = [
    vehicle_id,
    driver_id,
    assigned_from,
    assigned_to,
    status || 'ACTIVE',
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};


// Update assignment
const updateAssignment = async (
  id,
  {
    vehicle_id,
    driver_id,
    assigned_from,
    assigned_to,
    status,
  }
) => {
  const query = `
    UPDATE driver_assignments
    SET
      vehicle_id = $1,
      driver_id = $2,
      assigned_from = $3,
      assigned_to = $4,
      status = $5
    WHERE id = $6
    RETURNING *;
  `;

  const values = [
    vehicle_id,
    driver_id,
    assigned_from,
    assigned_to,
    status,
    id,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};


// Delete assignment
const deleteAssignment = async (id) => {
  const query = `
    DELETE FROM driver_assignments
    WHERE id = $1
    RETURNING *;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};


module.exports = {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
};