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
} from '@mui/material';

import {
  Add,
  Delete,
  Edit,
  People,
} from '@mui/icons-material';

import ProtectedRoute from '../../routes/ProtectedRoute';
import MainLayout from '../../components/layout/MainLayout';

import {
  getDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
} from '../../api/driver.api';

const emptyForm = {
  name: '',
  phone: '',
  license_number: '',
  license_expiry: '',
  status: 'ACTIVE',
};

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadDrivers = async () => {
    try {
      setLoading(true);

      const response = await getDrivers();

      setDrivers(response.data || []);
    } catch (error) {
      console.error('Failed to load drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrivers();
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

  const openEditDialog = (driver) => {
    setEditingId(driver.id);

    setFormData({
      name: driver.name || '',
      phone: driver.phone || '',
      license_number: driver.license_number || '',
      license_expiry: driver.license_expiry
        ? driver.license_expiry.substring(0, 10)
        : '',
      status: driver.status || 'ACTIVE',
    });

    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      if (editingId) {
        await updateDriver(editingId, formData);
      } else {
        await createDriver(formData);
      }

      setOpenDialog(false);
      loadDrivers();
    } catch (error) {
      console.error('Failed to save driver:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this driver?'
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteDriver(id);
      loadDrivers();
    } catch (error) {
      console.error('Failed to delete driver:', error);
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
              Drivers
            </Typography>

            <Typography color="text.secondary">
              Manage all drivers in your fleet.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openAddDialog}
          >
            Add Driver
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
            ) : drivers.length === 0 ? (
              <Box sx={{ textAlign: 'center', padding: 5 }}>
                <People
                  sx={{ fontSize: 60, color: 'text.secondary' }}
                />

                <Typography variant="h6" sx={{ marginTop: 1 }}>
                  No drivers found
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>ID</strong></TableCell>
                      <TableCell><strong>Name</strong></TableCell>
                      <TableCell><strong>Phone</strong></TableCell>
                      <TableCell><strong>License Number</strong></TableCell>
                      <TableCell><strong>License Expiry</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {drivers.map((driver) => (
                      <TableRow key={driver.id} hover>
                        <TableCell>{driver.id}</TableCell>
                        <TableCell>{driver.name}</TableCell>
                        <TableCell>{driver.phone || '-'}</TableCell>
                        <TableCell>{driver.license_number || '-'}</TableCell>
                        <TableCell>
                          {driver.license_expiry
                            ? driver.license_expiry.substring(0, 10)
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={driver.status}
                            color={
                              driver.status === 'ACTIVE'
                                ? 'success'
                                : 'default'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => openEditDialog(driver)}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(driver.id)}
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
            {editingId ? 'Edit Driver' : 'Add Driver'}
          </DialogTitle>

          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
              margin="normal"
              placeholder="9876543210"
            />

            <TextField
              fullWidth
              label="License Number"
              name="license_number"
              value={formData.license_number}
              onChange={handleFormChange}
              margin="normal"
            />

            <TextField
              fullWidth
              type="date"
              label="License Expiry"
              name="license_expiry"
              value={formData.license_expiry}
              onChange={handleFormChange}
              margin="normal"
              slotProps={{ inputLabel: { shrink: true } }}
            />

            {editingId && (
              <TextField
                fullWidth
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                margin="normal"
              >
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
              </TextField>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving || !formData.name}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>

      </MainLayout>
    </ProtectedRoute>
  );
}
