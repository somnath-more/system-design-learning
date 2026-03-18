import { useEffect, useState, useMemo } from 'react';
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
  Grid,
  MenuItem,
  Chip,
  CircularProgress,
  TablePagination,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBooks,
  searchBooks,
  deleteBook,
  selectAllBooks,
  selectBooksLoading,
} from '../redux/slices/booksSlice';

import { AppDispatch } from '../redux/store';
import { Book, BookStatus } from '../types';
import Header from '@/components/organisms/Header';

export default function Books() {
  const dispatch = useDispatch<AppDispatch>();
  const books = useSelector(selectAllBooks);
  const loading = useSelector(selectBooksLoading);

  // ---------------- STATE ----------------
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [sortField, setSortField] = useState<keyof Book>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // ---------------- FETCH ----------------
  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  // ---------------- DEBOUNCED SEARCH ----------------
  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchTerm.trim()) {
        dispatch(searchBooks(searchTerm));
      } else {
        dispatch(fetchBooks());
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [searchTerm, dispatch]);

  // ---------------- FILTER + SORT ----------------
  const filteredBooks = useMemo(() => {
    return books
      ?.filter((book) => {
        return (
          (!statusFilter || book.status === statusFilter) &&
          (!categoryFilter ||
            book.category?.toLowerCase().includes(categoryFilter.toLowerCase()))
        );
      })
      ?.sort((a: Book, b: Book) => {
        const aVal = a[sortField]?? '';
        const bVal = b[sortField]?? '';

        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [books, statusFilter, categoryFilter, sortField, sortOrder]);

  // ---------------- PAGINATION ----------------
  const paginatedBooks = useMemo(() => {
    return filteredBooks?.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredBooks, page, rowsPerPage]);

  // ---------------- ACTIONS ----------------
  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this book?')) {
      await dispatch(deleteBook(id));
      dispatch(fetchBooks());
    }
  };

  const handleSort = (field: keyof Book) => {
    setSortField(field);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const getStatusColor = (status: BookStatus) => {
    switch (status) {
      case BookStatus.AVAILABLE:
        return 'success';
      case BookStatus.BORROWED:
        return 'error';
      case BookStatus.RESERVED:
        return 'warning';
      default:
        return 'default';
    }
  };

  // ---------------- UI ----------------
  return (
    <Box>
      <Header activeTab="books" />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Books Management
        </Typography>

        {/* 🔍 FILTERS */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size='small'
                label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                size='small'

                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {Object.values(BookStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                size='small'
                 
                fullWidth
                label="Category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* 📊 TABLE */}
        <TableContainer component={Paper}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell onClick={() => handleSort('isbn')} sx={{ cursor: 'pointer' }}>
                      ISBN
                    </TableCell>
                    <TableCell onClick={() => handleSort('title')} sx={{ cursor: 'pointer' }}>
                      Title
                    </TableCell>
                    <TableCell onClick={() => handleSort('author')} sx={{ cursor: 'pointer' }}>
                      Author
                    </TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Copies</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedBooks?.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>{book.isbn}</TableCell>
                      <TableCell>{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>{book.category}</TableCell>
                      <TableCell>{book.totalCopies}</TableCell>
                      <TableCell>
                        <Chip
                          label={book.status}
                          color={getStatusColor(book.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(book.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* 📄 PAGINATION */}
              <TablePagination
                component="div"
                count={filteredBooks?.length || 0}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              />
            </>
          )}
        </TableContainer>
      </Container>
    </Box>
  );
}