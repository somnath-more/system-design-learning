package com.library.service.impl;

import com.library.dto.ApiResponse;
import com.library.dto.BorrowRecordDTO;
import com.library.entity.Book;
import com.library.entity.BorrowRecord;
import com.library.entity.User;
import com.library.enums.ApiStatus;
import com.library.enums.BorrowStatus;
import com.library.exception.BadRequestException;
import com.library.exception.ResourceNotFoundException;
import com.library.repository.BookRepository;
import com.library.repository.BorrowRecordRepository;
import com.library.repository.UserRepository;
import com.library.service.BookService;
import com.library.service.BorrowRecordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BorrowRecordServiceImpl implements BorrowRecordService {
    
    private final BorrowRecordRepository borrowRecordRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final BookService bookService;
    private final ModelMapper modelMapper;
    
    private static final int MAX_BORROW_LIMIT = 5;
    private static final double FINE_PER_DAY = 1.0;
    
    @Transactional(readOnly = true)
    public ApiResponse<List<BorrowRecordDTO>> getAllRecords() {
        List<BorrowRecordDTO> borrowRecordDTOS = borrowRecordRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ApiResponse.<List<BorrowRecordDTO>>builder()
                .data(borrowRecordDTOS)
                .statusCode(200)
                .status(ApiStatus.SUCCESS)
                .success(true)
                .message("All records retrieved successfully")
                .build();
    }
    
    @Transactional(readOnly = true)
    public ApiResponse<BorrowRecordDTO> getRecordById(Long id) {
        BorrowRecord record = borrowRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Borrow record not found with id: " + id));
        BorrowRecordDTO borrowRecordDTO= convertToDTO(record);
        return ApiResponse.<BorrowRecordDTO>builder()
                .data(borrowRecordDTO)
                .statusCode(200)
                .status(ApiStatus.SUCCESS)
                .success(true)
                .message("Record retrieved successfully")
                .build();
    }
    
    @Transactional(readOnly = true)
    public ApiResponse<List<BorrowRecordDTO>> getRecordsByUserId(Long userId) {
        List<BorrowRecordDTO> borrowRecordDTOS = borrowRecordRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ApiResponse.<List<BorrowRecordDTO>>builder()
                .data(borrowRecordDTOS)
                .statusCode(200)
                .status(ApiStatus.SUCCESS)
                .success(true)
                .message("Records for user retrieved successfully")
                .build();
    }
    
    @Transactional(readOnly = true)
    public ApiResponse<List<BorrowRecordDTO>> getActiveRecordsByUserId(Long userId) {
        List<BorrowRecordDTO> borrowRecordDTOS = borrowRecordRepository.findActiveRecordsByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ApiResponse.<List<BorrowRecordDTO>>builder()
                .data(borrowRecordDTOS)
                .statusCode(200)
                .status(ApiStatus.SUCCESS)
                .success(true)
                .message("Active records for user retrieved successfully")
                .build();
    }
    @Transactional
    public ApiResponse<List<BorrowRecordDTO>> getRecordsByBookId(Long bookId) {
        List<BorrowRecordDTO> borrowRecordDTOS = borrowRecordRepository.findByBookId(bookId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ApiResponse.<List<BorrowRecordDTO>>builder()
                .data(borrowRecordDTOS)
                .statusCode(200)
                .status(ApiStatus.SUCCESS)
                .success(true)
                .message("Records for book retrieved successfully")
                .build();
    }
    
    @Transactional(readOnly = true)
    public ApiResponse<List<BorrowRecordDTO>> getOverdueRecords() {
        List<BorrowRecordDTO> borrowRecordDTOS =borrowRecordRepository.findOverdueRecords(LocalDate.now()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ApiResponse.<List<BorrowRecordDTO>>builder()
                .data(borrowRecordDTOS)
                .statusCode(200)
                .status(ApiStatus.SUCCESS)
                .success(true)
                .message("OverDue Records retrieved successfully")
                .build();
    }
    
    @Transactional
    public ApiResponse<BorrowRecordDTO> borrowBook(BorrowRecordDTO recordDTO) {
        User user = userRepository.findById(recordDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Book book = bookRepository.findById(recordDTO.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));
        
        // Check borrow limit
        Long activeRecords = borrowRecordRepository.countActiveRecordsByUserId(user.getId());
        if (activeRecords >= MAX_BORROW_LIMIT) {
            throw new BadRequestException("User has reached maximum borrow limit");
        }
        
        // Check book availability
        if (book.getAvailableCopies() <= 0) {
            throw new BadRequestException("Book is not available for borrowing");
        }
        
        BorrowRecord record = BorrowRecord.builder()
                .user(user)
                .book(book)
                .borrowDate(recordDTO.getBorrowDate())
                .dueDate(recordDTO.getDueDate())
                .status(BorrowStatus.BORROWED)
                .returned(false)
                .fineAmount(0.0)
                .notes(recordDTO.getNotes())
                .build();
        
        BorrowRecord savedRecord = borrowRecordRepository.save(record);
        
        // Update book available copies
        bookService.updateAvailableCopies(book.getId(), -1);
        
        BorrowRecordDTO borrowRecordDTO= convertToDTO(savedRecord);
        return ApiResponse.<BorrowRecordDTO>builder()
                .data(borrowRecordDTO)
                .statusCode(200)
                .status(ApiStatus.SUCCESS)
                .success(true)
                .message("Book borrowed successfully")
                .build();
    }
    
    @Transactional
    public ApiResponse<BorrowRecordDTO> returnBook(Long recordId) {
        BorrowRecord record = borrowRecordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("Borrow record not found"));
        
        if (record.getReturned()) {
            throw new BadRequestException("Book has already been returned");
        }
        
        LocalDate returnDate = LocalDate.now();
        log.info("Return date for record {}: {}", recordId, returnDate);
        record.setReturnDate(returnDate);
        record.setReturned(true);
        record.setStatus(BorrowStatus.RETURNED);

        
        // Calculate fine if overdue
        if (returnDate.isAfter(record.getDueDate())) {
            long daysOverdue = ChronoUnit.DAYS.between(record.getDueDate(), returnDate);
            double fine = daysOverdue * FINE_PER_DAY;
            record.setStatus(BorrowStatus.OVERDUE);
            record.setFineAmount(fine);
        }
        
        BorrowRecord updatedRecord = borrowRecordRepository.save(record);
        
        // Update book available copies
        bookService.updateAvailableCopies(record.getBook().getId(), 1);
        
        BorrowRecordDTO borrowRecordDTO= convertToDTO(updatedRecord);
        return ApiResponse.<BorrowRecordDTO>builder()
                .data(borrowRecordDTO)
                .statusCode(200)
                .status(ApiStatus.SUCCESS)
                .success(true)
                .message("Book returned successfully")
                .build();
    }
    
    @Transactional
    public ApiResponse<BorrowRecordDTO> updateRecord(Long id, BorrowRecordDTO recordDTO) {
        BorrowRecord record = borrowRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Borrow record not found"));
        
        record.setDueDate(recordDTO.getDueDate());
        record.setNotes(recordDTO.getNotes());
        
        BorrowRecord updatedRecord = borrowRecordRepository.save(record);
        BorrowRecordDTO borrowRecordDTO= convertToDTO(updatedRecord);
        return ApiResponse.<BorrowRecordDTO>builder()
                .data(borrowRecordDTO)
                .statusCode(200)
                .status(ApiStatus.SUCCESS)
                .success(true)
                .message("Record updated successfully")
                .build();

    }
    
    @Transactional
    public ApiResponse<Object> deleteRecord(Long id) {
        if (!borrowRecordRepository.existsById(id)) {
            throw new ResourceNotFoundException("Borrow record not found with id: " + id);
        }
        borrowRecordRepository.deleteById(id);
        return ApiResponse.builder()
                .statusCode(200)
                .status(ApiStatus.SUCCESS)
                .data(Map.of("deletedId", id))
                .success(true)
                .message("Record deleted successfully")
                .build();
    }
    
    private BorrowRecordDTO convertToDTO(BorrowRecord record) {
        BorrowRecordDTO dto = modelMapper.map(record, BorrowRecordDTO.class);
        dto.setUsername(record.getUser().getUsername());
        dto.setBookTitle(record.getBook().getTitle());
        dto.setBookAuthor(record.getBook().getAuthor());
        return dto;
    }
}
