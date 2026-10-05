'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Button,
} from '@mui/material';

import {
  DirectionsCar,
  People,
  Route,
  Payments,
  LocalGasStation,
  Build,
  ArrowForward,
} from '@mui/icons-material';

import { useRouter } from 'next/navigation';

import ProtectedRoute from '../../routes/ProtectedRoute';
import MainLayout from '../../components/layout/MainLayout';
import { useAuth } from '../../context/AuthContext';
import { getDashboardSummary } from '../../api/report.api';

const HighchartsReact = dynamic(
  () => import('highcharts-react-official'),
  { ssr: false }
);

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [Highcharts, setHighcharts] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('highcharts').then((module) => {
      setHighcharts(module.default || module);
    });
  }, []);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true);

        const response = await getDashboardSummary();

        setSummary(response.data);
      } catch (error) {
        console.error('Failed to load dashboard summary:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  const formatCurrency = (value) => {
    const num = Number(value || 0);

    return `₹${num.toLocaleString('en-IN', {
      maximumFractionDigits: 0,
    })}`;
  };

  const stats = [
    {
      title: 'Vehicles',
      value: summary?.total_vehicles ?? '-',
      icon: <DirectionsCar fontSize="large" />,
      color: '#1976d2',
      path: '/vehicles',
    },
    {
      title: 'Drivers',
      value: summary?.total_drivers ?? '-',
      icon: <People fontSize="large" />,
      color: '#2e7d32',
      path: '/drivers',
    },
    {
      title: 'Trips',
      value: summary
        ? `${summary.completed_trips}/${summary.total_trips}`
        : '-',
      icon: <Route fontSize="large" />,
      color: '#ef6c00',
      path: '/trips',
    },
    {
      title: 'Total Expenses',
      value: summary
        ? formatCurrency(
            Number(summary.total_fuel_cost) +
              Number(summary.total_maintenance_cost) +
              Number(summary.total_other_expenses)
          )
        : '-',
      icon: <Payments fontSize="large" />,
      color: '#9c27b0',
      path: '/reports',
    },
  ];

  const totalCost = summary
    ? Number(summary.total_fuel_cost) +
      Number(summary.total_maintenance_cost) +
      Number(summary.total_other_expenses)
    : 0;

  const costBreakdownOptions = summary && {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      height: 280,
    },
    title: {
      text: totalCost
        ? `₹${totalCost.toLocaleString('en-IN', {
            maximumFractionDigits: 0,
          })}`
        : '₹0',
      align: 'center',
      verticalAlign: 'middle',
      y: 8,
      style: { fontSize: '20px', fontWeight: 'bold' },
    },
    tooltip: {
      pointFormat:
        '{series.name}: <b>₹{point.y:,.0f}</b> ({point.percentage:.1f}%)',
    },
    plotOptions: {
      pie: {
        innerSize: '68%',
        dataLabels: { enabled: false },
        showInLegend: false,
        borderWidth: 2,
      },
    },
    legend: { enabled: false },
    series: [
      {
        name: 'Cost',
        data: [
          {
            name: 'Fuel',
            y: Number(summary.total_fuel_cost),
            color: '#1976d2',
          },
          {
            name: 'Maintenance',
            y: Number(summary.total_maintenance_cost),
            color: '#ef6c00',
          },
          {
            name: 'Other',
            y: Number(summary.total_other_expenses),
            color: '#9c27b0',
          },
        ],
      },
    ],
    credits: { enabled: false },
  };

  const costLegendItems = summary && [
    {
      label: 'Fuel',
      value: Number(summary.total_fuel_cost),
      color: '#1976d2',
    },
    {
      label: 'Maintenance',
      value: Number(summary.total_maintenance_cost),
      color: '#ef6c00',
    },
    {
      label: 'Other',
      value: Number(summary.total_other_expenses),
      color: '#9c27b0',
    },
  ];

  const quickLinks = [
    { label: 'Log Fuel Entry', path: '/fuel', icon: <LocalGasStation /> },
    { label: 'Schedule Maintenance', path: '/maintenance', icon: <Build /> },
    { label: 'Record Trip', path: '/trips', icon: <Route /> },
  ];

  return (
    <ProtectedRoute>
      <MainLayout>

        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Dashboard
        </Typography>

        <Typography color="text.secondary" sx={{ marginBottom: 3 }}>
          Welcome back, {user?.name || 'User'}!
        </Typography>

        {loading ? (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', padding: 6 }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {stats.map((stat) => (
                <Grid item xs={12} sm={6} md={3} key={stat.title}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease',
                      '&:hover': { transform: 'translateY(-3px)' },
                    }}
                    onClick={() => router.push(stat.path)}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Box>
                          <Typography color="text.secondary" variant="body2">
                            {stat.title}
                          </Typography>

                          <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{ marginTop: 1 }}
                          >
                            {stat.value}
                          </Typography>
                        </Box>

                        <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={3} sx={{ marginTop: 0.5 }} alignItems="flex-start">
              <Grid item xs={12} md={7}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Cost Breakdown
                    </Typography>

                    {summary && Highcharts ? (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        <Box sx={{ flex: '0 0 280px', width: '100%' }}>
                          <HighchartsReact
                            highcharts={Highcharts}
                            options={costBreakdownOptions}
                          />
                        </Box>

                        <Box
                          sx={{
                            flex: 1,
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                          }}
                        >
                          {costLegendItems.map((item) => {
                            const percent = totalCost
                              ? ((item.value / totalCost) * 100).toFixed(1)
                              : 0;

                            return (
                              <Box key={item.label}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 0.5,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 1,
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%',
                                        backgroundColor: item.color,
                                      }}
                                    />

                                    <Typography variant="body2">
                                      {item.label}
                                    </Typography>
                                  </Box>

                                  <Typography variant="body2" fontWeight="bold">
                                    {formatCurrency(item.value)}
                                  </Typography>
                                </Box>

                                <Box
                                  sx={{
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: 'action.hover',
                                    overflow: 'hidden',
                                  }}
                                >
                                  <Box
                                    sx={{
                                      height: '100%',
                                      width: `${percent}%`,
                                      backgroundColor: item.color,
                                      borderRadius: 3,
                                    }}
                                  />
                                </Box>
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                    ) : (
                      <Typography color="text.secondary">
                        No expense data yet.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={5}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Quick Actions
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                        marginTop: 2,
                      }}
                    >
                      {quickLinks.map((link) => (
                        <Button
                          key={link.path}
                          variant="outlined"
                          startIcon={link.icon}
                          endIcon={<ArrowForward />}
                          onClick={() => router.push(link.path)}
                          sx={{
                            justifyContent: 'space-between',
                            textTransform: 'none',
                            paddingY: 1.5,
                          }}
                        >
                          {link.label}
                        </Button>
                      ))}
                    </Box>

                    <Box
                      sx={{
                        marginTop: 3,
                        paddingTop: 2,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
                      >
                        Trip Completion
                      </Typography>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'baseline',
                          marginTop: 1,
                        }}
                      >
                        <Typography variant="h5" fontWeight="bold">
                          {summary?.total_trips
                            ? Math.round(
                                (summary.completed_trips /
                                  summary.total_trips) *
                                  100
                              )
                            : 0}
                          %
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          {summary?.completed_trips || 0} of{' '}
                          {summary?.total_trips || 0} trips completed
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'action.hover',
                          overflow: 'hidden',
                          marginTop: 1,
                        }}
                      >
                        <Box
                          sx={{
                            height: '100%',
                            width: `${
                              summary?.total_trips
                                ? (summary.completed_trips /
                                    summary.total_trips) *
                                  100
                                : 0
                            }%`,
                            backgroundColor: '#2e7d32',
                            borderRadius: 4,
                          }}
                        />
                      </Box>

                      <Typography
                        color="text.secondary"
                        sx={{ marginTop: 2 }}
                        variant="body2"
                      >
                        Manage vehicles, drivers, assignments and full
                        analytics from the navigation menu.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}

      </MainLayout>
    </ProtectedRoute>
  );
}