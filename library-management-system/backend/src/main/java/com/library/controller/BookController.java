package com.library.controller;

import com.library.dto.ApiResponse;
import com.library.dto.BookDTO;
import com.library.dto.PaginatedResponse;
import com.library.enums.BookStatus;
import com.library.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@Slf4j
public class BookController {
    
    private final BookService bookService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<PaginatedResponse<BookDTO>>> getAllBooks(
            @RequestParam(value = "page",defaultValue = "0") int page,
            @RequestParam(value = "size",defaultValue = "10") int size
    ) {
        log.info("C -> Fetching all books");

        return ResponseEntity.ok(bookService.getAllBooks(page, size));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BookDTO> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }
    
    @GetMapping("/isbn/{isbn}")
    public ResponseEntity<BookDTO> getBookByIsbn(@PathVariable String isbn) {
        return ResponseEntity.ok(bookService.getBookByIsbn(isbn));
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<BookDTO>>> searchBooks(@RequestParam String keyword) {
        return ResponseEntity.ok(bookService.searchBooks(keyword));
    }
    
    @GetMapping("/category")
    public ResponseEntity<ApiResponse<List<BookDTO>>> getBooksByCategory(@RequestParam String category) {
        return ResponseEntity.ok(bookService.getBooksByCategory(category));
    }
    
    @GetMapping("/status")
    public ResponseEntity<ApiResponse<List<BookDTO>>> getBooksByStatus(@RequestParam BookStatus status) {
        return ResponseEntity.ok(bookService.getBooksByStatus(status));
    }
    
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<String>>> getAllCategories() {

        return ResponseEntity.ok(bookService.getAllCategories());
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<BookDTO> createBook(@Valid @RequestBody BookDTO bookDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookService.createBook(bookDTO));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<ApiResponse<BookDTO>> updateBook(
            @PathVariable Long id,
            @Valid @RequestBody BookDTO bookDTO) {
        return ResponseEntity.ok(bookService.updateBook(id, bookDTO));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }
}
