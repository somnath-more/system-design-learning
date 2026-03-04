package com.library.service;

import com.library.dto.ApiResponse;
import com.library.dto.BookDTO;
import com.library.dto.PaginatedResponse;
import com.library.enums.BookStatus;

import java.util.List;

public interface BookService {
    public ApiResponse<PaginatedResponse<BookDTO>> getAllBooks(int page, int size) ;
    public ApiResponse<List<String>> getAllCategories();
    public BookDTO getBookById(Long id) ;
    BookDTO getBookByIsbn(String isbn) ;
    public BookDTO createBook(BookDTO bookDTO) ;
    public ApiResponse<BookDTO> updateBook(Long id, BookDTO bookDTO);
    ApiResponse<List<BookDTO>> searchBooks(String keyword);
    public ApiResponse<List<BookDTO>> getBooksByCategory(String category);
    public ApiResponse<List<BookDTO>> getBooksByStatus(BookStatus status);
    void updateAvailableCopies(Long bookId, int change);
    public void deleteBook(Long id) ;
}
