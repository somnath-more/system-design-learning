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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../redux/slices/authSlice';
import { borrowService } from '../services/borrowService';
import { BorrowRecord } from '../types';
import { format } from 'date-fns';

export default function BorrowRecords() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAdmin, isLibrarian } = useAuth();

  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    userId: user?.id || 0,
    bookId: 0,
    borrowDate: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    notes: '',
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = isAdmin() || isLibrarian()
        ? await borrowService.getAllRecords()
        : await borrowService.getRecordsByUserId(user!.id);
      setRecords(data);
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    try {
      await borrowService.borrowBook(formData);
      setOpenDialog(false);
      fetchRecords();
      setFormData({
        userId: user?.id || 0,
        bookId: 0,
        borrowDate: format(new Date(), 'yyyy-MM-dd'),
        dueDate: format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        notes: '',
      });
    } catch (error) {
      console.error('Error borrowing book:', error);
    }
  };

  const handleReturn = async (id: number) => {
    if (window.confirm('Return this book?')) {
      try {
        await borrowService.returnBook(id);
        fetchRecords();
      } catch (error) {
        console.error('Error returning book:', error);
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isOverdue = (dueDate: string, returned: boolean) => {
    if (returned) return false;
    return new Date(dueDate) < new Date();
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
          {(isAdmin() || isLibrarian()) && (
            <Button color="inherit" onClick={() => navigate('/users')}>
              Users
            </Button>
          )}
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">Borrow Records</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Borrow Book
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Book ID</TableCell>
                <TableCell>Book Title</TableCell>
                {(isAdmin() || isLibrarian()) && <TableCell>User</TableCell>}
                <TableCell>Borrow Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Return Date</TableCell>
                <TableCell>Fine</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.bookId}</TableCell>
                  <TableCell>{record.bookTitle || 'N/A'}</TableCell>
                  {(isAdmin() || isLibrarian()) && (
                    <TableCell>{record.username}</TableCell>
                  )}
                  <TableCell>{record.borrowDate}</TableCell>
                  <TableCell>{record.dueDate}</TableCell>
                  <TableCell>{record.returnDate || 'Not returned'}</TableCell>
                  <TableCell>${record.fineAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    {record.returned ? (
                      <Chip label="Returned" color="success" size="small" />
                    ) : isOverdue(record.dueDate, record.returned) ? (
                      <Chip label="Overdue" color="error" size="small" />
                    ) : (
                      <Chip label="Active" color="primary" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    {!record.returned && (isAdmin() || isLibrarian()) && (
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleReturn(record.id)}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Borrow Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Borrow Book</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Book ID"
                type="number"
                value={formData.bookId}
                onChange={(e) =>
                  setFormData({ ...formData, bookId: parseInt(e.target.value) })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Borrow Date"
                type="date"
                value={formData.borrowDate}
                onChange={(e) =>
                  setFormData({ ...formData, borrowDate: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleBorrow} variant="contained">
            Borrow
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
