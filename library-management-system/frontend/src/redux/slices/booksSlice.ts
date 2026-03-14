import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { bookService } from '../../services/bookService';
import { Book } from '../../types';
import toast from 'react-hot-toast';

interface BooksState {
  items: Book[];
  selectedBook: Book | null;
  loading: boolean;
  error: string | null;
  categories: string[];
}

const initialState: BooksState = {
  items: [],
  selectedBook: null,
  loading: false,
  error: null,
  categories: [],
};

// Async thunks
export const fetchBooks = createAsyncThunk('books/fetchAll', async () => {
  return await bookService.getAllBooks();
});

export const fetchBookById = createAsyncThunk('books/fetchById', async (id: number) => {
  return await bookService.getBookById(id);
});

export const searchBooks = createAsyncThunk('books/search', async (keyword: string) => {
  return await bookService.searchBooks(keyword);
});

export const createBook = createAsyncThunk('books/create', async (book: Partial<Book>) => {
  const result = await bookService.createBook(book);
  toast.success('Book created successfully!');
  return result;
});

export const updateBook = createAsyncThunk(
  'books/update',
  async ({ id, book }: { id: number; book: Partial<Book> }) => {
    const result = await bookService.updateBook(id, book);
    toast.success('Book updated successfully!');
    return result;
  }
);

export const deleteBook = createAsyncThunk('books/delete', async (id: number) => {
  await bookService.deleteBook(id);
  toast.success('Book deleted successfully!');
  return id;
});

export const fetchCategories = createAsyncThunk('books/fetchCategories', async () => {
  return await bookService.getAllCategories();
});

// Books slice
const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setSelectedBook: (state, action: PayloadAction<Book | null>) => {
      state.selectedBook = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch books';
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.selectedBook = action.payload;
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        console.log("Search results:", action.payload);
        console.log("State ",state);
        console.log("Search books state",searchBooks);
        
        
        state.items =  action.payload;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        const index = state.items.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.items = state.items.filter((b) => b.id !== action.payload);
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const { setSelectedBook, clearError } = booksSlice.actions;
export default booksSlice.reducer;

// Selectors
export const selectAllBooks = (state: { books: BooksState }) => state.books.items;
export const selectSelectedBook = (state: { books: BooksState }) => state.books.selectedBook;
export const selectBooksLoading = (state: { books: BooksState }) => state.books.loading;
export const selectCategories = (state: { books: BooksState }) => state.books.categories;
