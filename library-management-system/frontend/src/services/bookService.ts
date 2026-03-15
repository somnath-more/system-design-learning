import api from './api';
import { ApiResponse, Book, BookStatus, LibraryStats, PaginatedResponse, PaginatedUserResponse } from '../types';

export const bookService = {
  // Get all books
  getAllBooks: async (): Promise<PaginatedResponse<Book>['data']['content']> => {
    const response = await api.get<PaginatedResponse<Book>>('/books');
    console.log(response.data);
    return response.data.data.content;
  },

  // Get book by ID
  getBookById: async (id: number): Promise<Book> => {
    const { data } = await api.get<Book>(`/books/${id}`);
    console.log(data);
    return data;
  },

  // Get book by ISBN
  getBookByIsbn: async (isbn: string): Promise<Book> => {
    const { data } = await api.get<Book>(`/books/isbn/${isbn}`);
    console.log(data);
    return data;
  },

  // Search books by keyword
  searchBooks: async (keyword: string): Promise<Book[]> => {
    const { data } = await api.get<Book[]>('/books/search', {
      params: { keyword },
    });
    return data;
  },

  // Get books by category
  getBooksByCategory: async (category: string): Promise<Book[]> => {
    const { data } = await api.get<Book[]>(`/books/category/${category}`);
    return data;
  },

  // Get books by status
  getBooksByStatus: async (status: BookStatus): Promise<Book[]> => {
    const { data } = await api.get<Book[]>(`/books/status/${status}`);
    return data;
  },

  // Get all categories
  getAllCategories: async (): Promise<string[]> => {
    const { data } = await api.get<string[]>('/books/categories');
    return data;
  },

  // Create new book
  createBook: async (book: Partial<Book>): Promise<Book> => {
    const { data } = await api.post<Book>('/books', book);
    return data;
  },

  // Update existing book
  updateBook: async (id: number, book: Partial<Book>): Promise<Book> => {
    const { data } = await api.put<Book>(`/books/${id}`, book);
    return data;
  },

  // Delete book
  deleteBook: async (id: number): Promise<void> => {
    await api.delete(`/books/${id}`);
  },

  // GET STATs
  getLibraryStats: async (): Promise<ApiResponse<LibraryStats>['data']> => {
    const response= await api.get('/books/library/stats');
    return response.data.data;
  }
};
