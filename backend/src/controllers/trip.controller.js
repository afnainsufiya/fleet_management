const tripService = require('../services/trip.service');

const getAllTrips = async (req, res) => {
  try {
    const trips = await tripService.getAllTrips();

    res.status(200).json({
      success: true,
      data: trips,
    });
  } catch (error) {
    console.error('Error fetching trips:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch trips',
    });
  }
};

const getTripById = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await tripService.getTripById(id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }

    res.status(200).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    console.error('Error fetching trip:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch trip',
    });
  }
};

const createTrip = async (req, res) => {
  try {
    const trip = await tripService.createTrip(req.body);

    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      data: trip,
    });
  } catch (error) {
    console.error('Error creating trip:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to create trip',
    });
  }
};

const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await tripService.updateTrip(
      id,
      req.body
    );

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Trip updated successfully',
      data: trip,
    });
  } catch (error) {
    console.error('Error updating trip:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to update trip',
    });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await tripService.deleteTrip(id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Trip deleted successfully',
      data: trip,
    });
  } catch (error) {
    console.error('Error deleting trip:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to delete trip',
    });
  }
};

module.exports = {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
};