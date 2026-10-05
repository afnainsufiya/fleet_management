const expenseService = require('../services/expense.service');

const getAllExpenses = async (req, res) => {
  try {
    const expenses = await expenseService.getAllExpenses();

    res.status(200).json({
      success: true,
      data: expenses,
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch expenses',
    });
  }
};

const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;

    const expense =
      await expenseService.getExpenseById(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    console.error('Error fetching expense:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch expense',
    });
  }
};

const createExpense = async (req, res) => {
  try {
    const expense =
      await expenseService.createExpense(req.body);

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: expense,
    });
  } catch (error) {
    console.error('Error creating expense:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to create expense',
    });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense =
      await expenseService.updateExpense(
        id,
        req.body
      );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: expense,
    });
  } catch (error) {
    console.error('Error updating expense:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to update expense',
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense =
      await expenseService.deleteExpense(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
      data: expense,
    });
  } catch (error) {
    console.error('Error deleting expense:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to delete expense',
    });
  }
};

module.exports = {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
};