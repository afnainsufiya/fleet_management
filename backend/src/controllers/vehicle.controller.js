const vehicleService = require('../services/vehicle.service');

const getAllVehicles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status,
      sortBy = 'id',
      order = 'asc',
    } = req.query;

    const result = await vehicleService.getAllVehicles({
      page: Number(page),
      limit: Number(limit),
      search,
      status,
      sortBy,
      order,
    });

    res.status(200).json({
      success: true,
      data: result.vehicles,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch vehicles',
    });
  }
};
const createVehicle = async (req, res) => {
  try {
    const vehicle = await vehicleService.createVehicle(req.body);

    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: vehicle,
    });
  } catch (error) {
    console.error('Error creating vehicle:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to create vehicle',
    });
  }
};
const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await vehicleService.getVehicleById(id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    console.error('Error fetching vehicle:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch vehicle',
    });
  }
};
const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await vehicleService.updateVehicle(id, req.body);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      data: vehicle,
    });
  } catch (error) {
    console.error('Error updating vehicle:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to update vehicle',
    });
  }
};
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await vehicleService.deleteVehicle(id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully',
      data: vehicle,
    });
  } catch (error) {
    console.error('Error deleting vehicle:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to delete vehicle',
    });
  }
};
module.exports = {
  getAllVehicles,
    createVehicle,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
};