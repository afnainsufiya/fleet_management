const validateCreateVehicle = (req, res, next) => {
  const {
    vehicle_number,
    vehicle_type_id,
    manufacturer,
    model,
    purchase_date,
  } = req.body;

  if (!vehicle_number) {
    return res.status(400).json({
      success: false,
      message: 'Vehicle number is required',
    });
  }

  if (!vehicle_type_id) {
    return res.status(400).json({
      success: false,
      message: 'Vehicle type is required',
    });
  }

  if (isNaN(vehicle_type_id)) {
    return res.status(400).json({
      success: false,
      message: 'Vehicle type ID must be a number',
    });
  }

  if (purchase_date && isNaN(Date.parse(purchase_date))) {
    return res.status(400).json({
      success: false,
      message: 'Invalid purchase date',
    });
  }

  next();
};

module.exports = {
  
    
    validateCreateVehicle
};