import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  AppBar,
  Toolbar,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../redux/slices/authSlice';
import { userService } from '../services/userService';
import { User } from '../types';

export default function Users() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAdmin, isLibrarian } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin() && !isLibrarian()) {
      navigate('/dashboard');
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(id);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'error';
      case 'LIBRARIAN':
        return 'warning';
      case 'MEMBER':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      {/* Navigation */}
      <AppBar position="static">
        <Toolbar>
          <MenuBookIcon sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Library Management
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
          <Button color="inherit" onClick={() => navigate('/users')}>
            Users
          </Button>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">User Management</Typography>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.id}</TableCell>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.fullName || 'N/A'}</TableCell>
                  <TableCell>{u.phoneNumber || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip label={u.role} color={getRoleColor(u.role)} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={u.active ? 'Active' : 'Inactive'}
                      color={u.active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {isAdmin() && u.id !== user?.id && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(u.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
}
