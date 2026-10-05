'use client';

import { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Grid,
} from '@mui/material';

import {
  Add,
  Delete,
  Edit,
  Route as RouteIcon,
} from '@mui/icons-material';

import ProtectedRoute from '../../routes/ProtectedRoute';
import MainLayout from '../../components/layout/MainLayout';
import useLookups from '../../hooks/useLookups';

import {
  getTrips,
  createTrip,
  updateTrip,
  deleteTrip,
} from '../../api/trip.api';

const statusColors = {
  SCHEDULED: 'info',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'default',
};

const emptyForm = {
  vehicle_id: '',
  driver_id: '',
  start_location: '',
  end_location: '',
  start_time: '',
  end_time: '',
  start_odometer: '',
  end_odometer: '',
  distance: '',
  status: 'SCHEDULED',
};

export default function TripsPage() {
  const { vehicles, drivers } = useLookups();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadTrips = async () => {
    try {
      setLoading(true);

      const response = await getTrips();

      setTrips(response.data || []);
    } catch (error) {
      console.error('Failed to load trips:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openAddDialog = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setOpenDialog(true);
  };

  const toLocalInput = (value) => {
    if (!value) {
      return '';
    }

    // Trim ISO string to 'YYYY-MM-DDTHH:mm' for datetime-local input
    return value.substring(0, 16);
  };

  const openEditDialog = (trip) => {
    setEditingId(trip.id);

    setFormData({
      vehicle_id: trip.vehicle_id,
      driver_id: trip.driver_id,
      start_location: trip.start_location || '',
      end_location: trip.end_location || '',
      start_time: toLocalInput(trip.start_time),
      end_time: toLocalInput(trip.end_time),
      start_odometer: trip.start_odometer ?? '',
      end_odometer: trip.end_odometer ?? '',
      distance: trip.distance ?? '',
      status: trip.status || 'SCHEDULED',
    });

    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        ...formData,
        vehicle_id: Number(formData.vehicle_id),
        driver_id: Number(formData.driver_id),
        start_odometer: formData.start_odometer
          ? Number(formData.start_odometer)
          : null,
        end_odometer: formData.end_odometer
          ? Number(formData.end_odometer)
          : null,
        distance: formData.distance ? Number(formData.distance) : null,
        end_time: formData.end_time || null,
      };

      if (editingId) {
        await updateTrip(editingId, payload);
      } else {
        await createTrip(payload);
      }

      setOpenDialog(false);
      loadTrips();
    } catch (error) {
      console.error('Failed to save trip:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this trip?'
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteTrip(id);
      loadTrips();
    } catch (error) {
      console.error('Failed to delete trip:', error);
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 3,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Trips
            </Typography>

            <Typography color="text.secondary">
              Track vehicle trips across your fleet.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openAddDialog}
          >
            Add Trip
          </Button>
        </Box>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>

            {loading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: 5,
                }}
              >
                <CircularProgress />
              </Box>
            ) : trips.length === 0 ? (
              <Box sx={{ textAlign: 'center', padding: 5 }}>
                <RouteIcon
                  sx={{ fontSize: 60, color: 'text.secondary' }}
                />

                <Typography variant="h6" sx={{ marginTop: 1 }}>
                  No trips found
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>ID</strong></TableCell>
                      <TableCell><strong>Vehicle</strong></TableCell>
                      <TableCell><strong>Driver</strong></TableCell>
                      <TableCell><strong>Route</strong></TableCell>
                      <TableCell><strong>Distance</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {trips.map((trip) => (
                      <TableRow key={trip.id} hover>
                        <TableCell>{trip.id}</TableCell>
                        <TableCell>{trip.vehicle_number}</TableCell>
                        <TableCell>{trip.driver_name}</TableCell>
                        <TableCell>
                          {trip.start_location} → {trip.end_location}
                        </TableCell>
                        <TableCell>
                          {trip.distance != null ? `${trip.distance} km` : '-'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={trip.status}
                            color={statusColors[trip.status] || 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => openEditDialog(trip)}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(trip.id)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

          </CardContent>
        </Card>

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
            {editingId ? 'Edit Trip' : 'Add Trip'}
          </DialogTitle>

          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Vehicle"
                  name="vehicle_id"
                  value={formData.vehicle_id}
                  onChange={handleFormChange}
                  margin="normal"
                  required
                >
                  {vehicles.map((vehicle) => (
                    <MenuItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.vehicle_number}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Driver"
                  name="driver_id"
                  value={formData.driver_id}
                  onChange={handleFormChange}
                  margin="normal"
                  required
                >
                  {drivers.map((driver) => (
                    <MenuItem key={driver.id} value={driver.id}>
                      {driver.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Location"
                  name="start_location"
                  value={formData.start_location}
                  onChange={handleFormChange}
                  margin="normal"
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Location"
                  name="end_location"
                  value={formData.end_location}
                  onChange={handleFormChange}
                  margin="normal"
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Start Time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleFormChange}
                  margin="normal"
                  slotProps={{ inputLabel: { shrink: true } }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="End Time (optional)"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleFormChange}
                  margin="normal"
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Start Odometer"
                  name="start_odometer"
                  value={formData.start_odometer}
                  onChange={handleFormChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="End Odometer"
                  name="end_odometer"
                  value={formData.end_odometer}
                  onChange={handleFormChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Distance (km)"
                  name="distance"
                  value={formData.distance}
                  onChange={handleFormChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  margin="normal"
                >
                  <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                  <MenuItem value="CANCELLED">Cancelled</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleSave}
              disabled={
                saving ||
                !formData.vehicle_id ||
                !formData.driver_id ||
                !formData.start_location ||
                !formData.end_location ||
                !formData.start_time
              }
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>

      </MainLayout>
    </ProtectedRoute>
  );
}
