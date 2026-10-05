const express = require('express');
const cors = require('cors');
const vehicleRoutes = require('./routes/vehicle.routes');
const driverRoutes = require('./routes/driver.routes');
const tripRoutes = require('./routes/trip.routes');
const maintenanceRoutes = require('./routes/maintenance.routes');
const fuelRoutes = require('./routes/fuel.routes');
const reportRoutes = require('./routes/report.routes');
const expenseRoutes = require('./routes/expense.routes');

const driverAssignmentRoutes =
  require('./routes/driverAssignment.routes');
const authRoutes =
  require('./routes/auth.routes');
const errorHandler = require('./middleware/error.middleware');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Fleet Management API is running'
  });
});
app.use('/api', vehicleRoutes);
app.use('/api', driverRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/fuel', fuelRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/reports', reportRoutes);
app.use(
  '/api/driver-assignments',
  driverAssignmentRoutes
);
app.use(
  '/api/auth',
  authRoutes
);
app.use(errorHandler);
module.exports = app;