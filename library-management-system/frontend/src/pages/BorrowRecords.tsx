import Header from '@/components/organisms/Header';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  TablePagination,
  MenuItem,
} from '@mui/material';

import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { borrowService } from '../services/borrowService';
import { bookService } from '@/services/bookService';
import { BorrowRecord } from '../types';
import { useAuth } from '../components/hooks/useAuth';

export default function BorrowRecords() {
  const { user, isAdmin, isLibrarian } = useAuth();

  // ---------------- STATE ----------------
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [bookOptions, setBookOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [sortField, setSortField] = useState<keyof BorrowRecord>('borrowDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [openDialog, setOpenDialog] = useState(false);

  const [formData, setFormData] = useState({
    userId: user?.id || 0,
    bookId: 0,
    borrowDate: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    notes: '',
  });

  // ---------------- FETCH ----------------
  useEffect(() => {
    fetchRecords();
    fetchBooks();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data =
        isAdmin() || isLibrarian()
          ? await borrowService.getAllRecords()
          : await borrowService.getRecordsByUserId(user!.id);
      setRecords(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    const data = await bookService.getAllBooks();
    setBookOptions(data);
  };

  // ---------------- HELPERS ----------------
  const getStatus = (record: BorrowRecord) => {
    if (record.returned) return 'Returned';
    if (new Date(record.dueDate) < new Date()) return 'Overdue';
    return 'Active';
  };

  // ---------------- DEBOUNCE ----------------
  useEffect(() => {
    const delay = setTimeout(() => {}, 300);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  // ---------------- FILTER + SORT ----------------
  const filteredRecords = useMemo(() => {
    return records
      ?.filter((r) => {
        const matchesSearch =
          r.bookTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.username?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          !statusFilter || getStatus(r) === statusFilter;

        return matchesSearch && matchesStatus;
      })
      ?.sort((a: BorrowRecord, b: BorrowRecord) => {
        const aVal = a[sortField]??'';
        const bVal = b[sortField]??'';

        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [records, searchTerm, statusFilter, sortField, sortOrder]);

  // ---------------- PAGINATION ----------------
  const paginatedRecords = useMemo(() => {
    return filteredRecords?.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredRecords, page, rowsPerPage]);

  // ---------------- ACTIONS ----------------
  const handleReturn = async (id: number) => {
    if (window.confirm('Return this book?')) {
      await borrowService.returnBook(id);
      fetchRecords();
    }
  };

  const handleBorrow = async () => {
    await borrowService.borrowBook(formData);
    setOpenDialog(false);
    fetchRecords();
  };

  const handleSort = (field: keyof BorrowRecord) => {
    setSortField(field);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const getStatusColor = (status: string) => {
    if (status === 'Returned') return 'success';
    if (status === 'Overdue') return 'error';
    return 'primary';
  };

  // ---------------- UI ----------------
  return (
    <Box>
      <Header activeTab="borrow-records" />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Borrow Records
        </Typography>

        {/* 🔍 FILTERS */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size='small'
                label="Search (Book/User)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size='small'
                select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Returned">Returned</MenuItem>
                <MenuItem value="Overdue">Overdue</MenuItem>
              </TextField>
            </Grid>
                <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    size='small'
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                  >
                    Borrow Book
                  </Button>
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
                    <TableCell onClick={() => handleSort('bookId')} sx={{ cursor: 'pointer' }}>
                      Book ID
                    </TableCell>
                    <TableCell onClick={() => handleSort('bookTitle')} sx={{ cursor: 'pointer' }}>
                      Title
                    </TableCell>
                    {(isAdmin() || isLibrarian()) && (
                      <TableCell>User</TableCell>
                    )}
                    <TableCell onClick={() => handleSort('borrowDate')} sx={{ cursor: 'pointer' }}>
                      Borrow Date
                    </TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Return Date</TableCell>
                    <TableCell>Fine</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedRecords?.map((record) => {
                    const status = getStatus(record);

                    return (
                      <TableRow key={record.id}>
                        <TableCell>{record.bookId}</TableCell>
                        <TableCell>{record.bookTitle}</TableCell>
                        {(isAdmin() || isLibrarian()) && (
                          <TableCell>{record.username}</TableCell>
                        )}
                        <TableCell>{record.borrowDate}</TableCell>
                        <TableCell>{record.dueDate}</TableCell>
                        <TableCell>{record.returnDate || 'N/A'}</TableCell>
                        <TableCell>${record.fineAmount}</TableCell>
                        <TableCell>
                          <Chip
                            label={status}
                            color={getStatusColor(status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {!record.returned && (isAdmin() || isLibrarian()) && (
                            <IconButton
                              color="success"
                              onClick={() => handleReturn(record.id)}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* 📄 PAGINATION */}
              <TablePagination
                component="div"
                count={filteredRecords?.length || 0}
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

      {/* 📌 DIALOG */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>Borrow Book</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Autocomplete
                options={bookOptions}
                getOptionLabel={(o) => o.title}
                onChange={(e, val) =>
                  setFormData({ ...formData, bookId: val?.id })
                }
                renderInput={(params) => (
                  <TextField {...params} label="Book" />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleBorrow}>
            Borrow
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}