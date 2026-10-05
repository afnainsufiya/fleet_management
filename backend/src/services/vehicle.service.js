const pool = require('../db/database');

const getAllVehicles = async ({
  page = 1,
  limit = 10,
  search = '',
  status,
  sortBy = 'id',
  order = 'asc',
}) => {
  const offset = (page - 1) * limit;

  let query = `
    SELECT
      v.id,
      v.vehicle_number,
      vt.name AS vehicle_type,
      v.manufacturer,
      v.model,
      v.purchase_date,
      v.status,
      v.created_at
    FROM vehicles v
    JOIN vehicle_types vt
      ON v.vehicle_type_id = vt.id
    WHERE 1 = 1
  `;

  const values = [];
  let paramIndex = 1;

  if (search) {
    query += `
      AND (
        v.vehicle_number ILIKE $${paramIndex}
        OR v.manufacturer ILIKE $${paramIndex}
        OR v.model ILIKE $${paramIndex}
      )
    `;

    values.push(`%${search}%`);
    paramIndex++;
  }

  if (status) {
    query += `
      AND v.status = $${paramIndex}
    `;

    values.push(status);
    paramIndex++;
  }

  const allowedSortColumns = [
    'id',
    'vehicle_number',
    'manufacturer',
    'model',
    'purchase_date',
    'status',
    'created_at',
  ];

  const allowedOrders = ['asc', 'desc'];

  if (!allowedSortColumns.includes(sortBy)) {
    sortBy = 'id';
  }

  if (!allowedOrders.includes(order.toLowerCase())) {
    order = 'asc';
  }

  query += `
    ORDER BY v.${sortBy} ${order.toUpperCase()}
    LIMIT $${paramIndex}
    OFFSET $${paramIndex + 1}
  `;

  values.push(limit);
  values.push(offset);

  const result = await pool.query(query, values);

  // Count total records
  let countQuery = `
    SELECT COUNT(*) AS total
    FROM vehicles v
    WHERE 1 = 1
  `;

  const countValues = [];
  let countParamIndex = 1;

  if (search) {
    countQuery += `
      AND (
        v.vehicle_number ILIKE $${countParamIndex}
        OR v.manufacturer ILIKE $${countParamIndex}
        OR v.model ILIKE $${countParamIndex}
      )
    `;

    countValues.push(`%${search}%`);
    countParamIndex++;
  }

  if (status) {
    countQuery += `
      AND v.status = $${countParamIndex}
    `;

    countValues.push(status);
  }

  const countResult = await pool.query(
    countQuery,
    countValues
  );

  const totalRecords = Number(countResult.rows[0].total);

  return {
    vehicles: result.rows,
    pagination: {
      page,
      limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
    },
  };
};
const createVehicle = async ({
  vehicle_number,
  vehicle_type_id,
  manufacturer,
  model,
  purchase_date,
}) => {
  const query = `
    INSERT INTO vehicles
    (
      vehicle_number,
      vehicle_type_id,
      manufacturer,
      model,
      purchase_date
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const values = [
    vehicle_number,
    vehicle_type_id,
    manufacturer,
    model,
    purchase_date,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};
const getVehicleById = async (id) => {
  const query = `
    SELECT
      v.id,
      v.vehicle_number,
      vt.name AS vehicle_type,
      v.manufacturer,
      v.model,
      v.purchase_date,
      v.status,
      v.created_at
    FROM vehicles v
    JOIN vehicle_types vt
      ON v.vehicle_type_id = vt.id
    WHERE v.id = $1;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};
const updateVehicle = async (
  id,
  {
    vehicle_number,
    vehicle_type_id,
    manufacturer,
    model,
    purchase_date,
    status,
  }
) => {
  const query = `
    UPDATE vehicles
    SET
      vehicle_number = $1,
      vehicle_type_id = $2,
      manufacturer = $3,
      model = $4,
      purchase_date = $5,
      status = $6
    WHERE id = $7
    RETURNING *;
  `;

  const values = [
    vehicle_number,
    vehicle_type_id,
    manufacturer,
    model,
    purchase_date,
    status,
    id,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};
const deleteVehicle = async (id) => {
  const query = `
    DELETE FROM vehicles
    WHERE id = $1
    RETURNING *;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};
module.exports = {
  getAllVehicles,
    createVehicle,
    getVehicleById,
    updateVehicle,
    deleteVehicle,

};