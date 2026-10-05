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
  Payments,
} from '@mui/icons-material';

import ProtectedRoute from '../../routes/ProtectedRoute';
import MainLayout from '../../components/layout/MainLayout';
import useLookups from '../../hooks/useLookups';

import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../../api/expense.api';

const emptyForm = {
  vehicle_id: '',
  expense_type: '',
  amount: '',
  description: '',
  expense_date: '',
};

export default function ExpensesPage() {
  const { vehicles } = useLookups();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadExpenses = async () => {
    try {
      setLoading(true);

      const response = await getExpenses();

      setExpenses(response.data || []);
    } catch (error) {
      console.error('Failed to load expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
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

  const openEditDialog = (expense) => {
    setEditingId(expense.id);

    setFormData({
      vehicle_id: expense.vehicle_id,
      expense_type: expense.expense_type || '',
      amount: expense.amount ?? '',
      description: expense.description || '',
      expense_date: expense.expense_date
        ? expense.expense_date.substring(0, 10)
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
        amount: Number(formData.amount),
      };

      if (editingId) {
        await updateExpense(editingId, payload);
      } else {
        await createExpense(payload);
      }

      setOpenDialog(false);
      loadExpenses();
    } catch (error) {
      console.error('Failed to save expense:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this expense?'
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteExpense(id);
      loadExpenses();
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };

  const totalSpend = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
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
              Expenses
            </Typography>

            <Typography color="text.secondary">
              {expenses.length} entries · Total ₹
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
            Add Expense
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
            ) : expenses.length === 0 ? (
              <Box sx={{ textAlign: 'center', padding: 5 }}>
                <Payments
                  sx={{ fontSize: 60, color: 'text.secondary' }}
                />

                <Typography variant="h6" sx={{ marginTop: 1 }}>
                  No expenses found
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
                      <TableCell><strong>Amount</strong></TableCell>
                      <TableCell><strong>Description</strong></TableCell>
                      <TableCell><strong>Date</strong></TableCell>
                      <TableCell><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.id} hover>
                        <TableCell>{expense.id}</TableCell>
                        <TableCell>{expense.vehicle_number}</TableCell>
                        <TableCell>{expense.expense_type}</TableCell>
                        <TableCell>₹{expense.amount}</TableCell>
                        <TableCell>{expense.description || '-'}</TableCell>
                        <TableCell>
                          {expense.expense_date
                            ? expense.expense_date.substring(0, 10)
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => openEditDialog(expense)}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(expense.id)}
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
            {editingId ? 'Edit Expense' : 'Add Expense'}
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
                  label="Expense Type"
                  name="expense_type"
                  value={formData.expense_type}
                  onChange={handleFormChange}
                  margin="normal"
                  required
                  placeholder="Toll, Parking, Fine..."
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Amount"
                  name="amount"
                  value={formData.amount}
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

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="date"
                  label="Expense Date"
                  name="expense_date"
                  value={formData.expense_date}
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
                !formData.expense_type ||
                !formData.amount ||
                !formData.expense_date
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
