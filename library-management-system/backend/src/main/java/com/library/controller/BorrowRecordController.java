package com.library.controller;

import com.library.dto.ApiResponse;
import com.library.dto.BorrowRecordDTO;
import com.library.service.BorrowRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrow-records")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class BorrowRecordController {
    
    private final BorrowRecordService borrowRecordService;
    
    @GetMapping
//    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<ApiResponse<List<BorrowRecordDTO>>> getAllRecords() {
        return ResponseEntity.ok(borrowRecordService.getAllRecords());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BorrowRecordDTO>> getRecordById(@PathVariable Long id) {
        return ResponseEntity.ok(borrowRecordService.getRecordById(id));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<BorrowRecordDTO>>> getRecordsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(borrowRecordService.getRecordsByUserId(userId));
    }
    
    @GetMapping("/user/{userId}/active")
    public ResponseEntity<ApiResponse<List<BorrowRecordDTO>>> getActiveRecordsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(borrowRecordService.getActiveRecordsByUserId(userId));
    }
    
    @GetMapping("/overdue")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<ApiResponse<List<BorrowRecordDTO>>> getOverdueRecords() {
        return ResponseEntity.ok(borrowRecordService.getOverdueRecords());
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN', 'MEMBER')")
    public ResponseEntity<ApiResponse<BorrowRecordDTO>> borrowBook(@Valid @RequestBody BorrowRecordDTO recordDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(borrowRecordService.borrowBook(recordDTO));
    }
    
    @PutMapping("/{recordId}/return")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<ApiResponse<BorrowRecordDTO>> returnBook(@PathVariable Long recordId) {
        return ResponseEntity.ok(borrowRecordService.returnBook(recordId));
    }
    
    @PutMapping("/{recordId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<ApiResponse<BorrowRecordDTO>> updateRecord(
            @PathVariable Long recordId,
            @Valid @RequestBody BorrowRecordDTO recordDTO) {
        return ResponseEntity.ok(borrowRecordService.updateRecord(recordId, recordDTO));
    }
    
    @DeleteMapping("/{recordId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> deleteRecord(@PathVariable Long recordId) {
        borrowRecordService.deleteRecord(recordId);
        return ResponseEntity.noContent().build();
    }
}
