const pool = require('../db/database');

const getAllExpenses = async () => {
  const query = `
    SELECT
      e.id,
      e.vehicle_id,
      v.vehicle_number,
      e.expense_type,
      e.amount,
      e.description,
      e.expense_date,
      e.created_at
    FROM expenses e
    JOIN vehicles v
      ON e.vehicle_id = v.id
    ORDER BY e.id DESC;
  `;

  const result = await pool.query(query);

  return result.rows;
};

const getExpenseById = async (id) => {
  const query = `
    SELECT
      e.id,
      e.vehicle_id,
      v.vehicle_number,
      e.expense_type,
      e.amount,
      e.description,
      e.expense_date,
      e.created_at
    FROM expenses e
    JOIN vehicles v
      ON e.vehicle_id = v.id
    WHERE e.id = $1;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};

const createExpense = async ({
  vehicle_id,
  expense_type,
  amount,
  description,
  expense_date,
}) => {
  const query = `
    INSERT INTO expenses
    (
      vehicle_id,
      expense_type,
      amount,
      description,
      expense_date
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const values = [
    vehicle_id,
    expense_type,
    amount,
    description,
    expense_date,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const updateExpense = async (
  id,
  {
    vehicle_id,
    expense_type,
    amount,
    description,
    expense_date,
  }
) => {
  const query = `
    UPDATE expenses
    SET
      vehicle_id = $1,
      expense_type = $2,
      amount = $3,
      description = $4,
      expense_date = $5
    WHERE id = $6
    RETURNING *;
  `;

  const values = [
    vehicle_id,
    expense_type,
    amount,
    description,
    expense_date,
    id,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const deleteExpense = async (id) => {
  const query = `
    DELETE FROM expenses
    WHERE id = $1
    RETURNING *;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};

module.exports = {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
};