'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

import ProtectedRoute from '../../routes/ProtectedRoute';
import MainLayout from '../../components/layout/MainLayout';

import {
  getVehicleExpenseReport,
  getFuelSummary,
  getTripSummary,
  getMonthlyExpenseReport,
} from '../../api/report.api';

// Highcharts touches `window`, so it must only load on the client.
const HighchartsReact = dynamic(
  () => import('highcharts-react-official'),
  { ssr: false }
);

export default function ReportsPage() {
  const [Highcharts, setHighcharts] = useState(null);

  const [vehicleExpenses, setVehicleExpenses] = useState([]);
  const [fuelSummary, setFuelSummary] = useState([]);
  const [tripSummary, setTripSummary] = useState([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load Highcharts only in the browser to avoid SSR issues.
    import('highcharts').then((module) => {
      setHighcharts(module.default || module);
    });
  }, []);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);

        const [
          vehicleExpenseRes,
          fuelSummaryRes,
          tripSummaryRes,
          monthlyExpenseRes,
        ] = await Promise.all([
          getVehicleExpenseReport(),
          getFuelSummary(),
          getTripSummary(),
          getMonthlyExpenseReport(),
        ]);

        setVehicleExpenses(vehicleExpenseRes.data || []);
        setFuelSummary(fuelSummaryRes.data || []);
        setTripSummary(tripSummaryRes.data || []);
        setMonthlyExpenses(
          (monthlyExpenseRes.data || []).slice().reverse()
        );
      } catch (error) {
        console.error('Failed to load reports:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  if (loading || !Highcharts) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              padding: 8,
            }}
          >
            <CircularProgress />
          </Box>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  const vehicleExpenseOptions = {
    chart: { type: 'column', backgroundColor: 'transparent' },
    title: { text: null },
    xAxis: {
      categories: vehicleExpenses.map((row) => row.vehicle_number),
    },
    yAxis: { title: { text: 'Amount (₹)' } },
    plotOptions: {
      column: { stacking: 'normal' },
    },
    legend: { align: 'center' },
    series: [
      {
        name: 'Fuel',
        data: vehicleExpenses.map((row) => Number(row.fuel_cost)),
        color: '#1976d2',
      },
      {
        name: 'Maintenance',
        data: vehicleExpenses.map((row) => Number(row.maintenance_cost)),
        color: '#ef6c00',
      },
      {
        name: 'Other',
        data: vehicleExpenses.map((row) => Number(row.other_expenses)),
        color: '#9c27b0',
      },
    ],
    credits: { enabled: false },
  };

  const fuelSummaryOptions = {
    chart: { type: 'bar', backgroundColor: 'transparent' },
    title: { text: null },
    xAxis: {
      categories: fuelSummary.map((row) => row.vehicle_number),
    },
    yAxis: { title: { text: 'Litres' } },
    series: [
      {
        name: 'Total Fuel (L)',
        data: fuelSummary.map((row) => Number(row.total_fuel)),
        color: '#2e7d32',
      },
    ],
    credits: { enabled: false },
  };

  const monthlyExpenseOptions = {
    chart: { type: 'area', backgroundColor: 'transparent' },
    title: { text: null },
    xAxis: {
      categories: monthlyExpenses.map((row) => row.month),
    },
    yAxis: { title: { text: 'Amount (₹)' } },
    plotOptions: {
      area: { stacking: 'normal' },
    },
    series: [
      {
        name: 'Fuel',
        data: monthlyExpenses.map((row) => Number(row.fuel_cost)),
        color: '#1976d2',
      },
      {
        name: 'Maintenance',
        data: monthlyExpenses.map((row) => Number(row.maintenance_cost)),
        color: '#ef6c00',
      },
      {
        name: 'Other',
        data: monthlyExpenses.map((row) => Number(row.other_expenses)),
        color: '#9c27b0',
      },
    ],
    credits: { enabled: false },
  };

  return (
    <ProtectedRoute>
      <MainLayout>

        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Reports
        </Typography>

        <Typography color="text.secondary" sx={{ marginBottom: 3 }}>
          Fleet-wide expense, fuel and trip analytics.
        </Typography>

        <Grid container spacing={3}>

          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Expense Breakdown by Vehicle
                </Typography>

                {vehicleExpenses.length === 0 ? (
                  <Typography color="text.secondary">
                    No expense data yet.
                  </Typography>
                ) : (
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={vehicleExpenseOptions}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Fuel Volume by Vehicle
                </Typography>

                {fuelSummary.length === 0 ? (
                  <Typography color="text.secondary">
                    No fuel data yet.
                  </Typography>
                ) : (
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={fuelSummaryOptions}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Monthly Expense Trend
                </Typography>

                {monthlyExpenses.length === 0 ? (
                  <Typography color="text.secondary">
                    No monthly data yet.
                  </Typography>
                ) : (
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={monthlyExpenseOptions}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Trip Summary by Driver
                </Typography>

                {tripSummary.length === 0 ? (
                  <Typography color="text.secondary">
                    No trip data yet.
                  </Typography>
                ) : (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Vehicle</strong></TableCell>
                          <TableCell><strong>Driver</strong></TableCell>
                          <TableCell><strong>Total Trips</strong></TableCell>
                          <TableCell><strong>Completed</strong></TableCell>
                          <TableCell><strong>Total Distance</strong></TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {tripSummary.map((row, index) => (
                          <TableRow key={index} hover>
                            <TableCell>{row.vehicle_number}</TableCell>
                            <TableCell>{row.driver_name}</TableCell>
                            <TableCell>{row.total_trips}</TableCell>
                            <TableCell>{row.completed_trips}</TableCell>
                            <TableCell>
                              {Number(row.total_distance).toLocaleString()} km
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </Grid>

        </Grid>

      </MainLayout>
    </ProtectedRoute>
  );
}
