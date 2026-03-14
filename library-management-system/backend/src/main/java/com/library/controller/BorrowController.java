package com.library.controller;

import com.library.dto.ApiResponse;
import com.library.dto.BorrowRecordDTO;
import com.library.service.BorrowService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrow")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class BorrowController {
    
    private final BorrowService borrowService;
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<ApiResponse<BorrowRecordDTO.Response>> borrowBook(@Valid @RequestBody BorrowRecordDTO.Request request) {
        ApiResponse<BorrowRecordDTO.Response> response = borrowService.borrowBook(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @PutMapping("/{borrowId}/return")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<ApiResponse<BorrowRecordDTO.Response>> returnBook(
            @PathVariable Long borrowId,
            @Valid @RequestBody BorrowRecordDTO.ReturnRequest request) {
        ApiResponse<BorrowRecordDTO.Response> response = borrowService.returnBook(borrowId, request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<ApiResponse<List<BorrowRecordDTO.Response>>> getAllBorrowRecords() {
        ApiResponse<List<BorrowRecordDTO.Response>> responses = borrowService.getAllBorrowRecords();
        return ResponseEntity.ok(responses);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<BorrowRecordDTO.Response>>> getBorrowRecordsByUserId(@PathVariable Long userId) {
        ApiResponse<List<BorrowRecordDTO.Response>> responses = borrowService.getBorrowRecordsByUserId(userId);
        return ResponseEntity.ok(responses);
    }
    
    @GetMapping("/user/{userId}/active")
    public ResponseEntity<ApiResponse<List<BorrowRecordDTO.Response>>> getActiveBorrowRecords(@PathVariable Long userId) {
        ApiResponse<List<BorrowRecordDTO.Response>> responses = borrowService.getActiveBorrowRecords(userId);
        return ResponseEntity.ok(responses);
    }
//    DELETE RECORD
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<ApiResponse<Void>> deleteBorrowRecord(@PathVariable Long id) {
        ApiResponse<Void> response = borrowService.deleteBorrowRecord(id);
        return ResponseEntity.ok(response);
    }
}
