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
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
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
      // Error handled by Redux and toast
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ boxShadow: 6 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <MenuBookIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                Library Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to your account
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                margin="normal"
                value={formData.username}
                onChange={handleChange}
                required
                autoFocus
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                margin="normal"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>

              <Typography variant="body2" align="center">
                Don't have an account?{' '}
                <Link to="/register" style={{ color: '#1976d2', textDecoration: 'none' }}>
                  Register here
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
