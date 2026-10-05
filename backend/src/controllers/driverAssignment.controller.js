const driverAssignmentService = require('../services/driverAssignment.service');


// Get all assignments
const getAllAssignments = async (req, res) => {
  try {
    const assignments =
      await driverAssignmentService.getAllAssignments();

    res.status(200).json({
      success: true,
      data: assignments,
    });

  } catch (error) {
    console.error('Error fetching assignments:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch assignments',
    });
  }
};


// Get assignment by ID
const getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment =
      await driverAssignmentService.getAssignmentById(id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    res.status(200).json({
      success: true,
      data: assignment,
    });

  } catch (error) {
    console.error('Error fetching assignment:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch assignment',
    });
  }
};


// Create assignment
const createAssignment = async (req, res) => {
  try {
    const assignment =
      await driverAssignmentService.createAssignment(req.body);

    res.status(201).json({
      success: true,
      message: 'Driver assigned successfully',
      data: assignment,
    });

  } catch (error) {
    console.error('Error creating assignment:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to create assignment',
    });
  }
};


// Update assignment
const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment =
      await driverAssignmentService.updateAssignment(
        id,
        req.body
      );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Assignment updated successfully',
      data: assignment,
    });

  } catch (error) {
    console.error('Error updating assignment:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to update assignment',
    });
  }
};


// Delete assignment
const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment =
      await driverAssignmentService.deleteAssignment(id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Assignment deleted successfully',
      data: assignment,
    });

  } catch (error) {
    console.error('Error deleting assignment:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to delete assignment',
    });
  }
};


module.exports = {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
};