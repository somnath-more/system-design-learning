import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  Divider,
  Stack
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GoogleIcon from '@mui/icons-material/Google';

import { login, selectAuthLoading } from '../redux/slices/authSlice';
import { AppDispatch } from '../redux/store';
import { LoginRequest } from '../types';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectAuthLoading);

  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(login(formData)).unwrap();
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        fontFamily: `'Inter', sans-serif`,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 4,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}
        >
          <CardContent sx={{ p: 5 }}>
            
            {/* HEADER */}
            <Box textAlign="center" mb={4}>
              <MenuBookIcon
                sx={{
                  fontSize: 50,
                  color: '#2a5298',
                  mb: 1,
                }}
              />
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{ letterSpacing: 0.5 }}
              >
                Library System
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Welcome back 👋
              </Typography>
            </Box>

            {/* FORM */}
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  autoFocus
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />

                {/* LOGIN BUTTON */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    background:
                      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Sign In'}
                </Button>

                {/* DIVIDER */}
                <Divider sx={{ my: 1 }}>OR</Divider>

                {/* GOOGLE BUTTON */}
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<GoogleIcon />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  Continue with Google
                </Button>
              </Stack>

              {/* FOOTER */}
              <Typography
                variant="body2"
                align="center"
                sx={{ mt: 3 }}
              >
                Don’t have an account?{' '}
                <Link
                  to="/register"
                  style={{
                    color: '#2a5298',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Register
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}