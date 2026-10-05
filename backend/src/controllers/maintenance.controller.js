const maintenanceService = require('../services/maintenance.service');

const getAllMaintenance = async (req, res) => {
  try {
    const records =
      await maintenanceService.getAllMaintenanceRecords();

    res.status(200).json({
      success: true,
      data: records,
    });
  } catch (error) {
    console.error('Error fetching maintenance:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch maintenance records',
    });
  }
};

const getMaintenanceById = async (req, res) => {
  try {
    const { id } = req.params;

    const record =
      await maintenanceService.getMaintenanceById(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance record not found',
      });
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error('Error fetching maintenance:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch maintenance record',
    });
  }
};

const createMaintenance = async (req, res) => {
  try {
    const record =
      await maintenanceService.createMaintenance(req.body);

    res.status(201).json({
      success: true,
      message: 'Maintenance record created successfully',
      data: record,
    });
  } catch (error) {
    console.error('Error creating maintenance:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to create maintenance record',
    });
  }
};

const updateMaintenance = async (req, res) => {
  try {
    const { id } = req.params;

    const record =
      await maintenanceService.updateMaintenance(
        id,
        req.body
      );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance record not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Maintenance record updated successfully',
      data: record,
    });
  } catch (error) {
    console.error('Error updating maintenance:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to update maintenance record',
    });
  }
};

const deleteMaintenance = async (req, res) => {
  try {
    const { id } = req.params;

    const record =
      await maintenanceService.deleteMaintenance(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance record not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Maintenance record deleted successfully',
      data: record,
    });
  } catch (error) {
    console.error('Error deleting maintenance:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to delete maintenance record',
    });
  }
};

module.exports = {
  getAllMaintenance,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
};