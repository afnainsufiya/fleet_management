const fuelService = require('../services/fuel.service');

const getAllFuelRecords = async (req, res) => {
  try {
    const records = await fuelService.getAllFuelRecords();

    res.status(200).json({
      success: true,
      data: records,
    });
  } catch (error) {
    console.error('Error fetching fuel records:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch fuel records',
    });
  }
};

const getFuelRecordById = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await fuelService.getFuelRecordById(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Fuel record not found',
      });
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error('Error fetching fuel record:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch fuel record',
    });
  }
};

const createFuelRecord = async (req, res) => {
  try {
    const record = await fuelService.createFuelRecord(req.body);

    res.status(201).json({
      success: true,
      message: 'Fuel record created successfully',
      data: record,
    });
  } catch (error) {
    console.error('Error creating fuel record:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to create fuel record',
    });
  }
};

const updateFuelRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await fuelService.updateFuelRecord(
      id,
      req.body
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Fuel record not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Fuel record updated successfully',
      data: record,
    });
  } catch (error) {
    console.error('Error updating fuel record:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to update fuel record',
    });
  }
};

const deleteFuelRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await fuelService.deleteFuelRecord(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Fuel record not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Fuel record deleted successfully',
      data: record,
    });
  } catch (error) {
    console.error('Error deleting fuel record:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to delete fuel record',
    });
  }
};

module.exports = {
  getAllFuelRecords,
  getFuelRecordById,
  createFuelRecord,
  updateFuelRecord,
  deleteFuelRecord,
};