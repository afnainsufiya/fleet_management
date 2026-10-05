const pool = require('../db/database');


// 1. Dashboard Summary
const getDashboardSummary = async () => {
  const query = `
    SELECT
      (SELECT COUNT(*) FROM vehicles) AS total_vehicles,
      (SELECT COUNT(*) FROM drivers) AS total_drivers,
      (SELECT COUNT(*) FROM trips) AS total_trips,
      (SELECT COUNT(*) FROM trips WHERE status = 'COMPLETED') AS completed_trips,
      (SELECT COALESCE(SUM(total_cost), 0) FROM fuel_records) AS total_fuel_cost,
      (SELECT COALESCE(SUM(cost), 0) FROM maintenance_records) AS total_maintenance_cost,
      (SELECT COALESCE(SUM(amount), 0) FROM expenses) AS total_other_expenses;
  `;

  const result = await pool.query(query);

  return result.rows[0];
};


// 2. Vehicle Expense Report
const getVehicleExpenseReport = async () => {
  const query = `
    SELECT
      v.id,
      v.vehicle_number,

      COALESCE(
        (SELECT SUM(total_cost)
         FROM fuel_records
         WHERE vehicle_id = v.id),
        0
      ) AS fuel_cost,

      COALESCE(
        (SELECT SUM(cost)
         FROM maintenance_records
         WHERE vehicle_id = v.id),
        0
      ) AS maintenance_cost,

      COALESCE(
        (SELECT SUM(amount)
         FROM expenses
         WHERE vehicle_id = v.id),
        0
      ) AS other_expenses,

      (
        COALESCE(
          (SELECT SUM(total_cost)
           FROM fuel_records
           WHERE vehicle_id = v.id),
          0
        )
        +
        COALESCE(
          (SELECT SUM(cost)
           FROM maintenance_records
           WHERE vehicle_id = v.id),
          0
        )
        +
        COALESCE(
          (SELECT SUM(amount)
           FROM expenses
           WHERE vehicle_id = v.id),
          0
        )
      ) AS total_expense

    FROM vehicles v
    ORDER BY total_expense DESC;
  `;

  const result = await pool.query(query);

  return result.rows;
};


// 3. Fuel Summary
const getFuelSummary = async () => {
  const query = `
    SELECT
      v.vehicle_number,
      COUNT(f.id) AS fuel_entries,
      COALESCE(SUM(f.quantity), 0) AS total_fuel,
      COALESCE(SUM(f.total_cost), 0) AS total_fuel_cost,
      COALESCE(AVG(f.price_per_litre), 0) AS average_price_per_litre

    FROM vehicles v

    LEFT JOIN fuel_records f
      ON v.id = f.vehicle_id

    GROUP BY
      v.id,
      v.vehicle_number

    ORDER BY total_fuel_cost DESC;
  `;

  const result = await pool.query(query);

  return result.rows;
};


// 4. Trip Summary
const getTripSummary = async () => {
  const query = `
    SELECT
      v.vehicle_number,
      d.name AS driver_name,

      COUNT(t.id) AS total_trips,

      COUNT(
        CASE
          WHEN t.status = 'COMPLETED'
          THEN 1
        END
      ) AS completed_trips,

      COALESCE(SUM(t.distance), 0) AS total_distance

    FROM trips t

    JOIN vehicles v
      ON t.vehicle_id = v.id

    JOIN drivers d
      ON t.driver_id = d.id

    GROUP BY
      v.id,
      v.vehicle_number,
      d.id,
      d.name

    ORDER BY total_distance DESC;
  `;

  const result = await pool.query(query);

  return result.rows;
};


// 5. Monthly Expense Report
const getMonthlyExpenseReport = async () => {
  const query = `
    SELECT
      month,
      SUM(fuel_cost) AS fuel_cost,
      SUM(maintenance_cost) AS maintenance_cost,
      SUM(other_expenses) AS other_expenses,
      SUM(
        fuel_cost +
        maintenance_cost +
        other_expenses
      ) AS total_expense

    FROM (

      SELECT
        TO_CHAR(fuel_date, 'YYYY-MM') AS month,
        SUM(total_cost) AS fuel_cost,
        0 AS maintenance_cost,
        0 AS other_expenses
      FROM fuel_records
      GROUP BY TO_CHAR(fuel_date, 'YYYY-MM')

      UNION ALL

      SELECT
        TO_CHAR(service_date, 'YYYY-MM') AS month,
        0 AS fuel_cost,
        SUM(cost) AS maintenance_cost,
        0 AS other_expenses
      FROM maintenance_records
      GROUP BY TO_CHAR(service_date, 'YYYY-MM')

      UNION ALL

      SELECT
        TO_CHAR(expense_date, 'YYYY-MM') AS month,
        0 AS fuel_cost,
        0 AS maintenance_cost,
        SUM(amount) AS other_expenses
      FROM expenses
      GROUP BY TO_CHAR(expense_date, 'YYYY-MM')

    ) AS monthly_data

    GROUP BY month
    ORDER BY month DESC;
  `;

  const result = await pool.query(query);

  return result.rows;
};


module.exports = {
  getDashboardSummary,
  getVehicleExpenseReport,
  getFuelSummary,
  getTripSummary,
  getMonthlyExpenseReport,
};