package com.library.service.impl;

import com.library.dto.ApiResponse;
import com.library.dto.BookDTO;
import com.library.dto.LibraryStatsDTO;
import com.library.dto.PaginatedResponse;
import com.library.entity.Book;
import com.library.enums.ApiStatus;
import com.library.enums.BookStatus;
import com.library.exception.BadRequestException;
import com.library.exception.ResourceNotFoundException;
import com.library.repository.BookRepository;
import com.library.repository.BorrowRecordRepository;
import com.library.service.BookService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookServiceImpl implements BookService {
    
    private final BookRepository bookRepository;
    private final BorrowRecordRepository borrowRecordRepository;
    private final ModelMapper modelMapper;
    
    @Transactional(readOnly = true)
    @Override
    public ApiResponse<PaginatedResponse<BookDTO>> getAllBooks(int page, int size) {
        Pageable pageable= PageRequest.of(page, size);
        log.info("S->Fetching all books");
        log.info("Page: {}, Size: {}", page, size);
        Page<Book> bookPage = bookRepository.findAll(pageable);
        log.info("Total elements: {}, Total pages: {}", bookPage.getTotalElements(), bookPage.getTotalPages());
        List<BookDTO> content = bookPage.stream()
                .map(book -> modelMapper.map(book, BookDTO.class))
                .toList();
        log.info("Books in current page: {}", content.size());

        PaginatedResponse<BookDTO> response = PaginatedResponse.<BookDTO>builder()
                .content(content)
                .pageNumber(bookPage.getNumber())
                .pageSize(bookPage.getSize())
                .totalElements(bookPage.getTotalElements())
                .totalPages(bookPage.getTotalPages())
                .last(bookPage.isLast())
                .build();
        return ApiResponse.<PaginatedResponse<BookDTO>>builder()
                .statusCode(200)
                .status(ApiStatus.SUCCESS)
                .success(true)
                .data(response)
                .message("Books retrieved successfully")
                .build();

    }
    
    @Transactional(readOnly = true)
    @Override
    public BookDTO getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
        return modelMapper.map(book, BookDTO.class);
    }
    
    @Transactional(readOnly = true)
    @Override
    public BookDTO getBookByIsbn(String isbn) {
        Book book = bookRepository.findByIsbn(isbn)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ISBN: " + isbn));
        return modelMapper.map(book, BookDTO.class);
    }
    
    @Transactional
    @Override
    public BookDTO createBook(BookDTO bookDTO) {
        if (bookRepository.findByIsbn(bookDTO.getIsbn()).isPresent()) {
            throw new BadRequestException("Book with ISBN " + bookDTO.getIsbn() + " already exists");
        }
        
        Book book = modelMapper.map(bookDTO, Book.class);
        book.setAvailableCopies(book.getTotalCopies());
        
        Book savedBook = bookRepository.save(book);
        return modelMapper.map(savedBook, BookDTO.class);
    }
    
    @Transactional
    @Override
    public ApiResponse<BookDTO> updateBook(Long id, BookDTO bookDTO) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
        
        if (!book.getIsbn().equals(bookDTO.getIsbn()) && 
            bookRepository.findByIsbn(bookDTO.getIsbn()).isPresent()) {
            throw new BadRequestException("Book with ISBN " + bookDTO.getIsbn() + " already exists");
        }
        
        book.setIsbn(bookDTO.getIsbn());
        book.setTitle(bookDTO.getTitle());
        book.setAuthor(bookDTO.getAuthor());
        book.setPublisher(bookDTO.getPublisher());
        book.setPublicationYear(bookDTO.getPublicationYear());
        book.setDescription(bookDTO.getDescription());
        book.setCategory(bookDTO.getCategory());
        book.setShelfLocation(bookDTO.getShelfLocation());
        book.setTotalCopies(bookDTO.getTotalCopies());
        book.setStatus(bookDTO.getStatus());
        book.setCoverImageUrl(bookDTO.getCoverImageUrl());
        
        Book updatedBook = bookRepository.save(book);
        BookDTO bookDTO1= modelMapper.map(updatedBook, BookDTO.class);
        return ApiResponse.<BookDTO>builder()
                .statusCode(200)
                .status(ApiStatus.SUCCESS)
                .success(true)
                .data(bookDTO1)
                .message("Book updated successfully")
                .build();
    }
    
    @Transactional
    @Override
    public void deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new ResourceNotFoundException("Book not found with id: " + id);
        }
        bookRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<LibraryStatsDTO> getLibraryStats() {
        long totalBooks = bookRepository.countTotalBooks();
        long availableBooks = bookRepository.countBooksByStatus(BookStatus.AVAILABLE);
        long borrowedBooks = bookRepository.countBooksByStatus(BookStatus.BORROWED);
        long overdueBooks = borrowRecordRepository.countOverdueBooks();
        log.info("Total Books: {}, Available Books: {}, Borrowed Books: {}, Overdue Books: {}",
                totalBooks, availableBooks, borrowedBooks, overdueBooks);

        LibraryStatsDTO stats = LibraryStatsDTO.builder()
                .totalBooks(totalBooks)
                .availableBooks(availableBooks)
                .borrowedBooks(borrowedBooks)
                .dueBooks(overdueBooks)
                .build();

        return ApiResponse.<LibraryStatsDTO>builder()
                .statusCode(200)
                .status(ApiStatus.SUCCESS)
                .success(true)
                .data(stats)
                .message("Library statistics retrieved successfully")
                .build();
    }

    @Transactional(readOnly = true)
    public ApiResponse<List<BookDTO>> searchBooks(String keyword) {
        List<BookDTO>bookDTOS= bookRepository.searchBooks(keyword).stream()
                .map(book -> modelMapper.map(book, BookDTO.class))
                .collect(Collectors.toList());
        return ApiResponse.<List<BookDTO>>builder()
                .statusCode(200)
                .status(ApiStatus.SUCCESS)
                .success(true)
                .data(bookDTOS)
                .message("Books retrieved successfully")
                .build();
    }
    
    @Transactional(readOnly = true)
    @Override
    public ApiResponse<List<BookDTO>> getBooksByCategory(String category) {
        List<BookDTO> bookDTOS= bookRepository.findByCategory(category).stream()
                .map(book -> modelMapper.map(book, BookDTO.class))
                .collect(Collectors.toList());

        return ApiResponse.<List<BookDTO>>builder()
                .statusCode(200)
                .status(ApiStatus.SUCCESS)
                .success(true)
                .data(bookDTOS)
                .message("Books retrieved successfully for category: " + category)
                .build();

    }
    
    @Transactional(readOnly = true)
    @Override
    public ApiResponse<List<BookDTO>> getBooksByStatus(BookStatus status) {
        List<BookDTO> bookDTOS= bookRepository.findByStatus(status).stream()
                .map(book -> modelMapper.map(book, BookDTO.class))
                .collect(Collectors.toList());
        return ApiResponse.<List<BookDTO>>builder()
                .statusCode(200)
                .status(ApiStatus.SUCCESS)
                .success(true)
                .data(bookDTOS)
                .message("Books retrieved based on status : " + status + " successfully")
                .build();
    }
    
    @Transactional(readOnly = true)
    @Override
    public ApiResponse<List<String>> getAllCategories() {
        List<String> bookRepositoryAllCategories= bookRepository.findAllCategories();
        return ApiResponse.<List<String>>builder()
                .statusCode(200)
                .status(ApiStatus.SUCCESS)
                .success(true)
                .data(bookRepositoryAllCategories)
                .message("Book categories retrieved successfully")
                .build();
    }
    
    @Transactional
    @Override
    public void updateAvailableCopies(Long bookId, int change) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + bookId));
        
        int newAvailableCopies = book.getAvailableCopies() + change;
        if (newAvailableCopies < 0) {
            throw new BadRequestException("Not enough available copies");
        }
        
        book.setAvailableCopies(newAvailableCopies);
        if (newAvailableCopies == 0) {
            book.setStatus(BookStatus.BORROWED);
        } else if (book.getStatus() == BookStatus.BORROWED && newAvailableCopies > 0) {
            book.setStatus(BookStatus.AVAILABLE);
        }
        
        bookRepository.save(book);
    }
}
