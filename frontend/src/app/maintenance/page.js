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
  Build,
} from '@mui/icons-material';

import ProtectedRoute from '../../routes/ProtectedRoute';
import MainLayout from '../../components/layout/MainLayout';
import useLookups from '../../hooks/useLookups';

import {
  getMaintenanceRecords,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
} from '../../api/maintenance.api';

const statusColors = {
  PENDING: 'warning',
  IN_PROGRESS: 'info',
  COMPLETED: 'success',
};

const emptyForm = {
  vehicle_id: '',
  maintenance_type: '',
  description: '',
  cost: '',
  service_date: '',
  next_service_date: '',
  status: 'COMPLETED',
};

export default function MaintenancePage() {
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

      const response = await getMaintenanceRecords();

      setRecords(response.data || []);
    } catch (error) {
      console.error('Failed to load maintenance records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
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

  const openEditDialog = (record) => {
    setEditingId(record.id);

    setFormData({
      vehicle_id: record.vehicle_id,
      maintenance_type: record.maintenance_type || '',
      description: record.description || '',
      cost: record.cost ?? '',
      service_date: record.service_date
        ? record.service_date.substring(0, 10)
        : '',
      next_service_date: record.next_service_date
        ? record.next_service_date.substring(0, 10)
        : '',
      status: record.status || 'COMPLETED',
    });

    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        ...formData,
        vehicle_id: Number(formData.vehicle_id),
        cost: Number(formData.cost),
        next_service_date: formData.next_service_date || null,
      };

      if (editingId) {
        await updateMaintenance(editingId, payload);
      } else {
        await createMaintenance(payload);
      }

      setOpenDialog(false);
      loadRecords();
    } catch (error) {
      console.error('Failed to save maintenance record:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this maintenance record?'
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMaintenance(id);
      loadRecords();
    } catch (error) {
      console.error('Failed to delete maintenance record:', error);
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
              Maintenance
            </Typography>

            <Typography color="text.secondary">
              Track service and repair history.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openAddDialog}
          >
            Add Record
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
                <Build
                  sx={{ fontSize: 60, color: 'text.secondary' }}
                />

                <Typography variant="h6" sx={{ marginTop: 1 }}>
                  No maintenance records found
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>ID</strong></TableCell>
                      <TableCell><strong>Vehicle</strong></TableCell>
                      <TableCell><strong>Type</strong></TableCell>
                      <TableCell><strong>Cost</strong></TableCell>
                      <TableCell><strong>Service Date</strong></TableCell>
                      <TableCell><strong>Next Service</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {records.map((record) => (
                      <TableRow key={record.id} hover>
                        <TableCell>{record.id}</TableCell>
                        <TableCell>{record.vehicle_number}</TableCell>
                        <TableCell>{record.maintenance_type}</TableCell>
                        <TableCell>₹{record.cost}</TableCell>
                        <TableCell>
                          {record.service_date
                            ? record.service_date.substring(0, 10)
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {record.next_service_date
                            ? record.next_service_date.substring(0, 10)
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={record.status}
                            color={statusColors[record.status] || 'default'}
                            size="small"
                          />
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
            {editingId ? 'Edit Maintenance Record' : 'Add Maintenance Record'}
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
                  label="Maintenance Type"
                  name="maintenance_type"
                  value={formData.maintenance_type}
                  onChange={handleFormChange}
                  margin="normal"
                  required
                  placeholder="Oil Change, Tyre Replacement..."
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Cost"
                  name="cost"
                  value={formData.cost}
                  onChange={handleFormChange}
                  margin="normal"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  margin="normal"
                  multiline
                  rows={2}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Service Date"
                  name="service_date"
                  value={formData.service_date}
                  onChange={handleFormChange}
                  margin="normal"
                  slotProps={{ inputLabel: { shrink: true } }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Next Service Date"
                  name="next_service_date"
                  value={formData.next_service_date}
                  onChange={handleFormChange}
                  margin="normal"
                  slotProps={{ inputLabel: { shrink: true } }}
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
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
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
                !formData.maintenance_type ||
                !formData.cost ||
                !formData.service_date
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
