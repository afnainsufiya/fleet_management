'use client';

import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Button,
} from '@mui/material';

import {
  Dashboard,
  DirectionsCar,
  People,
  Link as LinkIcon,
  Route,
  LocalGasStation,
  Build,
  Payments,
  Assessment,
  Logout,
  Menu,
} from '@mui/icons-material';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 240;

export default function MainLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, logout } = useAuth();

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <Dashboard />,
    },
    {
      label: 'Vehicles',
      path: '/vehicles',
      icon: <DirectionsCar />,
    },
    {
      label: 'Drivers',
      path: '/drivers',
      icon: <People />,
    },
    {
      label: 'Assignments',
      path: '/assignments',
      icon: <LinkIcon />,
    },
    {
      label: 'Trips',
      path: '/trips',
      icon: <Route />,
    },
    {
      label: 'Fuel',
      path: '/fuel',
      icon: <LocalGasStation />,
    },
    {
      label: 'Maintenance',
      path: '/maintenance',
      icon: <Build />,
    },
    {
      label: 'Expenses',
      path: '/expenses',
      icon: <Payments />,
    },
    {
      label: 'Reports',
      path: '/reports',
      icon: <Assessment />,
    },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,

          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            fontWeight="bold"
          >
            🚍 Fleet Management
          </Typography>
        </Toolbar>

        <Divider />

        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.path}
              selected={pathname === item.path}
              onClick={() => router.push(item.path)}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.label}
              />
            </ListItemButton>
          ))}
        </List>

        <Box sx={{ flexGrow: 1 }} />

        <Divider />

        <Box sx={{ padding: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Logged in as
          </Typography>

          <Typography
            variant="body1"
            fontWeight="bold"
          >
            {user?.name || 'User'}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            {user?.role || ''}
          </Typography>

          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{ marginTop: 2 }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: '#f5f7fa',
          minHeight: '100vh',
        }}
      >
        <AppBar
          position="static"
          color="inherit"
          elevation={1}
        >
          <Toolbar>
            <Typography
              variant="h6"
              fontWeight="bold"
            >
              Fleet Management System
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <Typography variant="body2">
              {user?.name}
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ padding: 3 }}>
          {children}
        </Box>
      </Box>

    </Box>
  );
}