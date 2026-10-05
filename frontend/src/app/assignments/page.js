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
  Alert,
} from '@mui/material';

import {
  Add,
  Delete,
  Edit,
  Link as LinkIcon,
} from '@mui/icons-material';

import ProtectedRoute from '../../routes/ProtectedRoute';
import MainLayout from '../../components/layout/MainLayout';
import { useAuth } from '../../context/AuthContext';
import useLookups from '../../hooks/useLookups';

import {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from '../../api/assignment.api';

const emptyForm = {
  vehicle_id: '',
  driver_id: '',
  assigned_from: '',
  assigned_to: '',
  status: 'ACTIVE',
};

export default function AssignmentsPage() {
  const { user } = useAuth();
  const { vehicles, drivers } = useLookups();

  // Backend only allows ADMIN/MANAGER to create/update,
  // and only ADMIN to delete assignments.
  const canManage = ['ADMIN', 'MANAGER'].includes(user?.role);
  const canDelete = user?.role === 'ADMIN';

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadAssignments = async () => {
    try {
      setLoading(true);

      const response = await getAssignments();

      setAssignments(response.data || []);
    } catch (error) {
      console.error('Failed to load assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
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
    setErrorMsg('');
    setOpenDialog(true);
  };

  const openEditDialog = (assignment) => {
    setEditingId(assignment.id);

    setFormData({
      vehicle_id: assignment.vehicle_id,
      driver_id: assignment.driver_id,
      assigned_from: assignment.assigned_from
        ? assignment.assigned_from.substring(0, 10)
        : '',
      assigned_to: assignment.assigned_to
        ? assignment.assigned_to.substring(0, 10)
        : '',
      status: assignment.status || 'ACTIVE',
    });

    setErrorMsg('');
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setErrorMsg('');

      const payload = {
        ...formData,
        vehicle_id: Number(formData.vehicle_id),
        driver_id: Number(formData.driver_id),
        assigned_to: formData.assigned_to || null,
      };

      if (editingId) {
        await updateAssignment(editingId, payload);
      } else {
        await createAssignment(payload);
      }

      setOpenDialog(false);
      loadAssignments();
    } catch (error) {
      console.error('Failed to save assignment:', error);

      setErrorMsg(
        error.response?.data?.message || 'Failed to save assignment'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this assignment?'
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteAssignment(id);
      loadAssignments();
    } catch (error) {
      console.error('Failed to delete assignment:', error);
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
              Driver Assignments
            </Typography>

            <Typography color="text.secondary">
              Assign drivers to vehicles.
            </Typography>
          </Box>

          {canManage && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={openAddDialog}
            >
              New Assignment
            </Button>
          )}
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
            ) : assignments.length === 0 ? (
              <Box sx={{ textAlign: 'center', padding: 5 }}>
                <LinkIcon
                  sx={{ fontSize: 60, color: 'text.secondary' }}
                />

                <Typography variant="h6" sx={{ marginTop: 1 }}>
                  No assignments found
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
                      <TableCell><strong>Phone</strong></TableCell>
                      <TableCell><strong>From</strong></TableCell>
                      <TableCell><strong>To</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      {(canManage || canDelete) && (
                        <TableCell><strong>Actions</strong></TableCell>
                      )}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {assignments.map((assignment) => (
                      <TableRow key={assignment.id} hover>
                        <TableCell>{assignment.id}</TableCell>
                        <TableCell>{assignment.vehicle_number}</TableCell>
                        <TableCell>{assignment.driver_name}</TableCell>
                        <TableCell>{assignment.driver_phone || '-'}</TableCell>
                        <TableCell>
                          {assignment.assigned_from
                            ? assignment.assigned_from.substring(0, 10)
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {assignment.assigned_to
                            ? assignment.assigned_to.substring(0, 10)
                            : 'Ongoing'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={assignment.status}
                            color={
                              assignment.status === 'ACTIVE'
                                ? 'success'
                                : 'default'
                            }
                            size="small"
                          />
                        </TableCell>
                        {(canManage || canDelete) && (
                          <TableCell>
                            {canManage && (
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  onClick={() => openEditDialog(assignment)}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}

                            {canDelete && (
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDelete(assignment.id)}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                        )}
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
            {editingId ? 'Edit Assignment' : 'New Assignment'}
          </DialogTitle>

          <DialogContent>
            {errorMsg && (
              <Alert severity="error" sx={{ marginTop: 1 }}>
                {errorMsg}
              </Alert>
            )}

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

            <TextField
              fullWidth
              type="date"
              label="Assigned From"
              name="assigned_from"
              value={formData.assigned_from}
              onChange={handleFormChange}
              margin="normal"
              slotProps={{ inputLabel: { shrink: true } }}
              required
            />

            <TextField
              fullWidth
              type="date"
              label="Assigned To (optional)"
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleFormChange}
              margin="normal"
              slotProps={{ inputLabel: { shrink: true } }}
            />

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
              <MenuItem value="COMPLETED">Completed</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </TextField>
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
                !formData.assigned_from
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
