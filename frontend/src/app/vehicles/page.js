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
} from '@mui/material';

import {
  Add,
  Delete,
  DirectionsCar,
} from '@mui/icons-material';

import ProtectedRoute from '../../routes/ProtectedRoute';
import MainLayout from '../../components/layout/MainLayout';

import {
  getVehicles,
  deleteVehicle,
  createVehicle,
} from '../../api/vehicle.api';
export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
const [openAdd, setOpenAdd] = useState(false);

const [formData, setFormData] = useState({
  vehicle_number: '',
  vehicle_type_id: '',
  manufacturer: '',
  model: '',
  purchase_date: '',
  status: 'ACTIVE',
});
const handleFormChange = (event) => {
  const { name, value } = event.target;

  setFormData((previous) => ({
    ...previous,
    [name]: value,
  }));
};

const handleAddVehicle = async () => {
  try {
    await createVehicle({
      ...formData,
      vehicle_type_id: Number(formData.vehicle_type_id),
    });

    setOpenAdd(false);

    setFormData({
      vehicle_number: '',
      vehicle_type_id: '',
      manufacturer: '',
      model: '',
      purchase_date: '',
      status: 'ACTIVE',
    });

    loadVehicles();
  } catch (error) {
    console.error(
      'Failed to create vehicle:',
      error
    );
  }
};
  const loadVehicles = async () => {
    try {
      setLoading(true);

      const response = await getVehicles();

      console.log('Vehicles response:', response);

      setVehicles(response.data || []);
    } catch (error) {
      console.error(
        'Failed to load vehicles:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this vehicle?'
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteVehicle(id);

      loadVehicles();
    } catch (error) {
      console.error(
        'Failed to delete vehicle:',
        error
      );
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
            <Typography
              variant="h4"
              fontWeight="bold"
            >
              Vehicles
            </Typography>

            <Typography
              color="text.secondary"
            >
              Manage all vehicles in your fleet.
            </Typography>
          </Box>

          <Button
  variant="contained"
  startIcon={<Add />}
  onClick={() => setOpenAdd(true)}
>
  Add Vehicle
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
            ) : vehicles.length === 0 ? (
              <Box
                sx={{
                  textAlign: 'center',
                  padding: 5,
                }}
              >
                <DirectionsCar
                  sx={{
                    fontSize: 60,
                    color: 'text.secondary',
                  }}
                />

                <Typography
                  variant="h6"
                  sx={{ marginTop: 1 }}
                >
                  No vehicles found
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper}>
                <Table>

                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>ID</strong>
                      </TableCell>

                      <TableCell>
                        <strong>Vehicle Number</strong>
                      </TableCell>

                      <TableCell>
                        <strong>Type</strong>
                      </TableCell>

                      <TableCell>
                        <strong>Manufacturer</strong>
                      </TableCell>

                      <TableCell>
                        <strong>Model</strong>
                      </TableCell>

                      <TableCell>
                        <strong>Status</strong>
                      </TableCell>

                      <TableCell>
                        <strong>Actions</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {vehicles.map((vehicle) => (
                      <TableRow key={vehicle.id}>

                        <TableCell>
                          {vehicle.id}
                        </TableCell>

                        <TableCell>
                          {vehicle.vehicle_number}
                        </TableCell>

                        <TableCell>
                         {vehicle.vehicle_type}
                        </TableCell>

                        <TableCell>
                          {vehicle.manufacturer || '-'}
                        </TableCell>

                        <TableCell>
                          {vehicle.model || '-'}
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={vehicle.status}
                            color={
                              vehicle.status === 'ACTIVE'
                                ? 'success'
                                : 'default'
                            }
                            size="small"
                          />
                        </TableCell>

                        <TableCell>
                          <Button
                            color="error"
                            size="small"
                            startIcon={<Delete />}
                            onClick={() =>
                              handleDelete(vehicle.id)
                            }
                          >
                            Delete
                          </Button>
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
  open={openAdd}
  onClose={() => setOpenAdd(false)}
  fullWidth
  maxWidth="sm"
>
  <DialogTitle>
    Add Vehicle
  </DialogTitle>

  <DialogContent>

    <TextField
      fullWidth
      label="Vehicle Number"
      name="vehicle_number"
      value={formData.vehicle_number}
      onChange={handleFormChange}
      margin="normal"
      required
      placeholder="KA04GH1234"
    />

    <TextField
      fullWidth
      select
      label="Vehicle Type"
      name="vehicle_type_id"
      value={formData.vehicle_type_id}
      onChange={handleFormChange}
      margin="normal"
      required
    >
      <MenuItem value={1}>
        Bus
      </MenuItem>

      <MenuItem value={2}>
        Truck
      </MenuItem>

      <MenuItem value={3}>
        Van
      </MenuItem>

      <MenuItem value={4}>
        Car
      </MenuItem>
    </TextField>

    <TextField
      fullWidth
      label="Manufacturer"
      name="manufacturer"
      value={formData.manufacturer}
      onChange={handleFormChange}
      margin="normal"
      placeholder="Tata"
    />

    <TextField
      fullWidth
      label="Model"
      name="model"
      value={formData.model}
      onChange={handleFormChange}
      margin="normal"
      placeholder="Starbus"
    />

    <TextField
      fullWidth
      type="date"
      label="Purchase Date"
      name="purchase_date"
      value={formData.purchase_date}
      onChange={handleFormChange}
      margin="normal"
      slotProps={{
        inputLabel: { shrink: true },
      }}
    />

  </DialogContent>

  <DialogActions>
    <Button
      onClick={() => setOpenAdd(false)}
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      onClick={handleAddVehicle}
    >
      Add Vehicle
    </Button>
  </DialogActions>
</Dialog>
      </MainLayout>
    </ProtectedRoute>
  );
}