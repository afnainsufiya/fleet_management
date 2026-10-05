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
  LocalGasStation,
} from '@mui/icons-material';

import ProtectedRoute from '../../routes/ProtectedRoute';
import MainLayout from '../../components/layout/MainLayout';
import useLookups from '../../hooks/useLookups';

import {
  getFuelRecords,
  createFuelRecord,
  updateFuelRecord,
  deleteFuelRecord,
} from '../../api/fuel.api';

const emptyForm = {
  vehicle_id: '',
  fuel_type: 'DIESEL',
  quantity: '',
  price_per_litre: '',
  total_cost: '',
  odometer: '',
  fuel_date: '',
};

export default function FuelPage() {
  const { vehicles } = useLookups();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadRecords = async () => {
    try {
      setLoading(true);

      const response = await getFuelRecords();

      setRecords(response.data || []);
    } catch (error) {
      console.error('Failed to load fuel records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  // Auto-calculate total cost when quantity/price change,
  // unless the user has manually overridden total_cost.
  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => {
      const updated = { ...previous, [name]: value };

      if (name === 'quantity' || name === 'price_per_litre') {
        const qty = parseFloat(
          name === 'quantity' ? value : previous.quantity
        );

        const price = parseFloat(
          name === 'price_per_litre' ? value : previous.price_per_litre
        );

        if (!isNaN(qty) && !isNaN(price)) {
          updated.total_cost = (qty * price).toFixed(2);
        }
      }

      return updated;
    });
  };

  const openAddDialog = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setOpenDialog(true);
  };

  const openEditDialog = (record) => {
    setEditingId(record.id);

    setFormData({
      vehicle_id: record.vehicle_id,
      fuel_type: record.fuel_type || 'DIESEL',
      quantity: record.quantity ?? '',
      price_per_litre: record.price_per_litre ?? '',
      total_cost: record.total_cost ?? '',
      odometer: record.odometer ?? '',
      fuel_date: record.fuel_date
        ? record.fuel_date.substring(0, 10)
        : '',
    });

    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        ...formData,
        vehicle_id: Number(formData.vehicle_id),
        quantity: Number(formData.quantity),
        price_per_litre: Number(formData.price_per_litre),
        total_cost: Number(formData.total_cost),
        odometer: formData.odometer ? Number(formData.odometer) : null,
      };

      if (editingId) {
        await updateFuelRecord(editingId, payload);
      } else {
        await createFuelRecord(payload);
      }

      setOpenDialog(false);
      loadRecords();
    } catch (error) {
      console.error('Failed to save fuel record:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this fuel record?'
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteFuelRecord(id);
      loadRecords();
    } catch (error) {
      console.error('Failed to delete fuel record:', error);
    }
  };

  const totalSpend = records.reduce(
    (sum, record) => sum + Number(record.total_cost || 0),
    0
  );

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
              Fuel Records
            </Typography>

            <Typography color="text.secondary">
              {records.length} entries · Total spend ₹
              {totalSpend.toLocaleString('en-IN', {
                maximumFractionDigits: 2,
              })}
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openAddDialog}
          >
            Add Fuel Record
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
            ) : records.length === 0 ? (
              <Box sx={{ textAlign: 'center', padding: 5 }}>
                <LocalGasStation
                  sx={{ fontSize: 60, color: 'text.secondary' }}
                />

                <Typography variant="h6" sx={{ marginTop: 1 }}>
                  No fuel records found
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>ID</strong></TableCell>
                      <TableCell><strong>Vehicle</strong></TableCell>
                      <TableCell><strong>Fuel Type</strong></TableCell>
                      <TableCell><strong>Quantity (L)</strong></TableCell>
                      <TableCell><strong>Price/L</strong></TableCell>
                      <TableCell><strong>Total Cost</strong></TableCell>
                      <TableCell><strong>Date</strong></TableCell>
                      <TableCell><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {records.map((record) => (
                      <TableRow key={record.id} hover>
                        <TableCell>{record.id}</TableCell>
                        <TableCell>{record.vehicle_number}</TableCell>
                        <TableCell>{record.fuel_type}</TableCell>
                        <TableCell>{record.quantity}</TableCell>
                        <TableCell>₹{record.price_per_litre}</TableCell>
                        <TableCell>₹{record.total_cost}</TableCell>
                        <TableCell>
                          {record.fuel_date
                            ? record.fuel_date.substring(0, 10)
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => openEditDialog(record)}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(record.id)}
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
          maxWidth="sm"
        >
          <DialogTitle>
            {editingId ? 'Edit Fuel Record' : 'Add Fuel Record'}
          </DialogTitle>

          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
                  label="Fuel Type"
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleFormChange}
                  margin="normal"
                >
                  <MenuItem value="DIESEL">Diesel</MenuItem>
                  <MenuItem value="PETROL">Petrol</MenuItem>
                  <MenuItem value="CNG">CNG</MenuItem>
                  <MenuItem value="ELECTRIC">Electric</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Odometer"
                  name="odometer"
                  value={formData.odometer}
                  onChange={handleFormChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Quantity (L)"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleFormChange}
                  margin="normal"
                  required
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Price / Litre"
                  name="price_per_litre"
                  value={formData.price_per_litre}
                  onChange={handleFormChange}
                  margin="normal"
                  required
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Total Cost"
                  name="total_cost"
                  value={formData.total_cost}
                  onChange={handleFormChange}
                  margin="normal"
                  required
                  helperText="Auto-calculated, editable"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fuel Date"
                  name="fuel_date"
                  value={formData.fuel_date}
                  onChange={handleFormChange}
                  margin="normal"
                  slotProps={{ inputLabel: { shrink: true } }}
                  required
                />
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
                !formData.quantity ||
                !formData.price_per_litre ||
                !formData.fuel_date
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
