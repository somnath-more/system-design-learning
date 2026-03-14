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
  Grid,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { register, selectAuthLoading } from '../redux/slices/authSlice';
import { AppDispatch } from '../redux/store';
import { RegisterRequest, Role } from '../types';

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectAuthLoading);

  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    address: '',
    role: Role.MEMBER,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(register(formData)).unwrap();
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
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Card sx={{ boxShadow: 6 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <MenuBookIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Join our library community
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <MenuItem value={Role.MEMBER}>Member</MenuItem>
                    <MenuItem value={Role.LIBRARIAN}>Librarian</MenuItem>
                    <MenuItem value={Role.ADMIN}>Admin</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    multiline
                    rows={2}
                    value={formData.address}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Register'}
              </Button>

              <Typography variant="body2" align="center">
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
