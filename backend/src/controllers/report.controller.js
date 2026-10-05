const reportService = require('../services/report.service');


// Dashboard
const getDashboardSummary = async (req, res) => {
  try {
    const data =
      await reportService.getDashboardSummary();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard summary',
    });
  }
};


// Vehicle Expenses
const getVehicleExpenseReport = async (req, res) => {
  try {
    const data =
      await reportService.getVehicleExpenseReport();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      'Error fetching vehicle expenses:',
      error
    );

    res.status(500).json({
      success: false,
      message: 'Failed to fetch vehicle expense report',
    });
  }
};


// Fuel Summary
const getFuelSummary = async (req, res) => {
  try {
    const data =
      await reportService.getFuelSummary();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching fuel summary:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch fuel summary',
    });
  }
};


// Trip Summary
const getTripSummary = async (req, res) => {
  try {
    const data =
      await reportService.getTripSummary();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching trip summary:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch trip summary',
    });
  }
};


// Monthly Expenses
const getMonthlyExpenseReport = async (req, res) => {
  try {
    const data =
      await reportService.getMonthlyExpenseReport();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      'Error fetching monthly expenses:',
      error
    );

    res.status(500).json({
      success: false,
      message: 'Failed to fetch monthly expense report',
    });
  }
};


module.exports = {
  getDashboardSummary,
  getVehicleExpenseReport,
  getFuelSummary,
  getTripSummary,
  getMonthlyExpenseReport,
};