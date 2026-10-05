const driverService = require('../services/driver.service');

const getAllDrivers = async (req, res) => {
  try {
    const drivers = await driverService.getAllDrivers();

    res.status(200).json({
      success: true,
      data: drivers,
    });
  } catch (error) {
    console.error('Error fetching drivers:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch drivers',
    });
  }
};

const getDriverById = async (req, res) => {
  try {
    const { id } = req.params;

    const driver = await driverService.getDriverById(id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found',
      });
    }

    res.status(200).json({
      success: true,
      data: driver,
    });
  } catch (error) {
    console.error('Error fetching driver:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch driver',
    });
  }
};

const createDriver = async (req, res) => {
  try {
    const driver = await driverService.createDriver(req.body);

    res.status(201).json({
      success: true,
      message: 'Driver created successfully',
      data: driver,
    });
  } catch (error) {
    console.error('Error creating driver:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to create driver',
    });
  }
};

const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;

    const driver = await driverService.updateDriver(
      id,
      req.body
    );

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Driver updated successfully',
      data: driver,
    });
  } catch (error) {
    console.error('Error updating driver:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to update driver',
    });
  }
};

const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;

    const driver = await driverService.deleteDriver(id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Driver deleted successfully',
      data: driver,
    });
  } catch (error) {
    console.error('Error deleting driver:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to delete driver',
    });
  }
};

module.exports = {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
};