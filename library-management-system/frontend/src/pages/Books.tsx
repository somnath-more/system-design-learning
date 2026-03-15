import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  Chip,
  AppBar,
  Toolbar,
  CircularProgress,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../components/hooks/useAuth';
import { logout } from '../redux/slices/authSlice';
import {
  fetchBooks,
  searchBooks,
  createBook,
  updateBook,
  deleteBook,
  selectAllBooks,
  selectBooksLoading,
} from '../redux/slices/booksSlice';
import { AppDispatch } from '../redux/store';
import { Book, BookStatus } from '../types';
import Header from '@/components/organisms/Header';

export default function Books() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAdmin, isLibrarian } = useAuth();
  const books = useSelector(selectAllBooks);
  const loading = useSelector(selectBooksLoading);

  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<Partial<Book>>({
    isbn: '',
    title: '',
    author: '',
    publisher: '',
    publicationYear: new Date().getFullYear(),
    category: '',
    totalCopies: 1,
    status: BookStatus.AVAILABLE,
  });

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      dispatch(searchBooks(searchTerm));
    } else {
      dispatch(fetchBooks());
    }
  };

  const handleOpenDialog = (book?: Book) => {
    if (book) {
      setEditingBook(book);
      setFormData(book);
    } else {
      setEditingBook(null);
      setFormData({
        isbn: '',
        title: '',
        author: '',
        publisher: '',
        publicationYear: new Date().getFullYear(),
        category: '',
        totalCopies: 1,
        status: BookStatus.AVAILABLE,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBook(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingBook) {
        await dispatch(updateBook({ id: editingBook.id, book: formData })).unwrap();
      } else {
        await dispatch(createBook(formData)).unwrap();
      }
      handleCloseDialog();
      dispatch(fetchBooks());
    } catch (error) {
      // Error handled by toast
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await dispatch(deleteBook(id)).unwrap();
        dispatch(fetchBooks());
      } catch (error) {
        // Error handled by toast
      }
    }
  };

  const getStatusColor = (status: BookStatus) => {
    switch (status) {
      case BookStatus.AVAILABLE:
        return 'success';
      case BookStatus.BORROWED:
        return 'error';
      case BookStatus.RESERVED:
        return 'warning';
      case BookStatus.MAINTENANCE:
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      {/* Navigation */}
         <Header activeTab="books" />

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">Books Management</Typography>
          {(isAdmin() || isLibrarian()) && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Book
            </Button>
          )}
        </Box>

        {/* Search */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              placeholder="Search books by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
            >
              Search
            </Button>
          </Box>
        </Paper>

        {/* Books Table */}
        <TableContainer component={Paper}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ISBN</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Copies</TableCell>
                  <TableCell>Available</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {books?.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>{book.isbn}</TableCell>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.category}</TableCell>
                    <TableCell>{book.totalCopies}</TableCell>
                    <TableCell>{book.availableCopies}</TableCell>
                    <TableCell>
                      <Chip
                        label={book.status}
                        color={getStatusColor(book.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {(isAdmin() || isLibrarian()) && (
                        <>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(book)}
                          >
                            <EditIcon />
                          </IconButton>
                          {isAdmin() && (
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(book.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Container>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingBook ? 'Edit Book' : 'Add New Book'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ISBN"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Publisher"
                value={formData.publisher}
                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Publication Year"
                type="number"
                value={formData.publicationYear}
                onChange={(e) =>
                  setFormData({ ...formData, publicationYear: parseInt(e.target.value) })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Copies"
                type="number"
                value={formData.totalCopies}
                onChange={(e) =>
                  setFormData({ ...formData, totalCopies: parseInt(e.target.value) })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as BookStatus })
                }
              >
                <MenuItem value={BookStatus.AVAILABLE}>Available</MenuItem>
                <MenuItem value={BookStatus.BORROWED}>Borrowed</MenuItem>
                <MenuItem value={BookStatus.RESERVED}>Reserved</MenuItem>
                <MenuItem value={BookStatus.MAINTENANCE}>Maintenance</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingBook ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
