const pool = require('../db/database');

const getAllMaintenanceRecords = async () => {
  const query = `
    SELECT
      m.id,
      m.vehicle_id,
      v.vehicle_number,
      m.maintenance_type,
      m.description,
      m.cost,
      m.service_date,
      m.next_service_date,
      m.status,
      m.created_at
    FROM maintenance_records m
    JOIN vehicles v
      ON m.vehicle_id = v.id
    ORDER BY m.id DESC;
  `;

  const result = await pool.query(query);

  return result.rows;
};

const getMaintenanceById = async (id) => {
  const query = `
    SELECT
      m.id,
      m.vehicle_id,
      v.vehicle_number,
      m.maintenance_type,
      m.description,
      m.cost,
      m.service_date,
      m.next_service_date,
      m.status,
      m.created_at
    FROM maintenance_records m
    JOIN vehicles v
      ON m.vehicle_id = v.id
    WHERE m.id = $1;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};

const createMaintenance = async ({
  vehicle_id,
  maintenance_type,
  description,
  cost,
  service_date,
  next_service_date,
  status,
}) => {
  const query = `
    INSERT INTO maintenance_records
    (
      vehicle_id,
      maintenance_type,
      description,
      cost,
      service_date,
      next_service_date,
      status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  const values = [
    vehicle_id,
    maintenance_type,
    description,
    cost,
    service_date,
    next_service_date,
    status || 'COMPLETED',
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const updateMaintenance = async (
  id,
  {
    vehicle_id,
    maintenance_type,
    description,
    cost,
    service_date,
    next_service_date,
    status,
  }
) => {
  const query = `
    UPDATE maintenance_records
    SET
      vehicle_id = $1,
      maintenance_type = $2,
      description = $3,
      cost = $4,
      service_date = $5,
      next_service_date = $6,
      status = $7
    WHERE id = $8
    RETURNING *;
  `;

  const values = [
    vehicle_id,
    maintenance_type,
    description,
    cost,
    service_date,
    next_service_date,
    status,
    id,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const deleteMaintenance = async (id) => {
  const query = `
    DELETE FROM maintenance_records
    WHERE id = $1
    RETURNING *;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};

module.exports = {
  getAllMaintenanceRecords,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
};