import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  Button,
  IconButton,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import WarningIcon from '@mui/icons-material/Warning';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const StatCard = ({ title, value, icon, color }: any) => (
  <Paper
    sx={{
      p: 3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '100%',
    }}
  >
    <Box>
      <Typography color="text.secondary" variant="body2" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h3" fontWeight="bold">
        {value}
      </Typography>
    </Box>
    <Box sx={{ color, fontSize: 60 }}>{icon}</Box>
  </Paper>
);

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Navigation Bar */}
      <AppBar position="static">
        <Toolbar>
          <MenuBookIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Library Management System
          </Typography>
          <Button color="inherit" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={() => navigate('/books')}>
            Books
          </Button>
          <Button color="inherit" onClick={() => navigate('/borrow-records')}>
            Borrow Records
          </Button>
          {(user?.role === 'ADMIN' || user?.role === 'LIBRARIAN') && (
            <Button color="inherit" onClick={() => navigate('/users')}>
              Users
            </Button>
          )}
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Dashboard Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.username}!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Role: <strong>{user?.role}</strong>
        </Typography>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Books"
              value="1,234"
              icon={<MenuBookIcon />}
              color="primary.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Borrows"
              value="89"
              icon={<LibraryBooksIcon />}
              color="success.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Users"
              value="456"
              icon={<PeopleIcon />}
              color="info.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Overdue"
              value="12"
              icon={<WarningIcon />}
              color="error.main"
            />
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <Typography color="text.secondary">
            Recent borrowing activity will be displayed here...
          </Typography>
        </Paper>

        {/* Quick Actions */}
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button variant="contained" onClick={() => navigate('/books')}>
              Browse Books
            </Button>
            <Button variant="outlined" onClick={() => navigate('/borrow-records')}>
              View Borrow Records
            </Button>
            {user?.role === 'ADMIN' && (
              <Button variant="outlined" onClick={() => navigate('/users')}>
                Manage Users
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
