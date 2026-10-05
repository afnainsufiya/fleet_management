'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material';

import {
  Visibility,
  VisibilityOff,
  LocalShipping,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
    const response = await api.post(
  '/auth/login',
  {
    email,
    password,
  }
);

      const { token, user } = response.data.data;

      login(token, user);

      // Go to dashboard
      router.push('/dashboard');

    } catch (error) {
      console.error('Login error:', error);

      setError(
        error.response?.data?.message ||
        'Login failed'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f7fa',
        padding: 2,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 420,
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        <CardContent sx={{ padding: 4 }}>

          {/* Logo */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 2,
            }}
          >
            <LocalShipping
              sx={{
                fontSize: 55,
                color: 'primary.main',
              }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
          >
            Fleet Management
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ marginTop: 1, marginBottom: 3 }}
          >
            Sign in to manage your fleet
          </Typography>


          {/* Error */}
          {error && (
            <Box
              sx={{
                backgroundColor: '#ffebee',
                color: '#c62828',
                padding: 1.5,
                borderRadius: 1,
                marginBottom: 2,
              }}
            >
              <Typography variant="body2">
                {error}
              </Typography>
            </Box>
          )}


          {/* Login Form */}
          <Box
            component="form"
            onSubmit={handleLogin}
          >

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              margin="normal"
              required
            />


            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              margin="normal"
              required
              slotProps={{
                input: {
                  endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                  ),
                },
              }}
            />


            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                marginTop: 3,
                height: 48,
                borderRadius: 2,
                fontWeight: 'bold',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

          </Box>

        </CardContent>
      </Card>
    </Box>
  );
}