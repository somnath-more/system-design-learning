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
import com.library.service.BorrowService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BorrowServiceImpl implements BorrowService {
    
    private final BorrowRecordRepository borrowRecordRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    
    private static final double FINE_PER_DAY = 1.0;
    
    @Transactional
    public ApiResponse<BorrowRecordDTO.Response> borrowBook(BorrowRecordDTO.Request request) {

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Book not found with id: " + request.getBookId()));

        if (book.getAvailableCopies() <= 0) {
            throw new BadRequestException("No copies available for this book");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        if (request.getBorrowDate() == null || request.getDueDate() == null) {
            throw new BadRequestException("Borrow and due date are required");
        }

        if (request.getDueDate().isBefore(request.getBorrowDate())) {
            throw new BadRequestException("Due date cannot be before borrow date");
        }

        BorrowRecord borrowRecord = BorrowRecord.builder()
                .book(book)
                .user(user)
                .borrowDate(request.getBorrowDate())
                .dueDate(request.getDueDate())
                .status(BorrowStatus.BORROWED)
                .notes(request.getNotes())
                .fineAmount(0.0)
                .build();

        book.setAvailableCopies(book.getAvailableCopies() - 1);

        BorrowRecord savedRecord = borrowRecordRepository.save(borrowRecord);

        BorrowRecordDTO.Response borrowRecordResponse= convertToResponse(savedRecord);
        return ApiResponse.<BorrowRecordDTO.Response >builder()
                .data(borrowRecordResponse)
                .statusCode(200)
                .status(ApiStatus.SUCCESS)
                .success(true)
                .message("Book borrowed successfully")
                .build();
    }

    @Transactional
    public ApiResponse<BorrowRecordDTO.Response> returnBook(Long borrowId,
                                               BorrowRecordDTO.ReturnRequest request) {

        BorrowRecord borrowRecord = borrowRecordRepository.findById(borrowId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Borrow record not found with id: " + borrowId));

        if (borrowRecord.getStatus() == BorrowStatus.RETURNED) {
            throw new BadRequestException("Book has already been returned");
        }

        if (request.getReturnDate() == null) {
            throw new BadRequestException("Return date is required");
        }

        borrowRecord.setReturnDate(request.getReturnDate());

        if (request.getReturnDate().isAfter(borrowRecord.getDueDate())) {
            long daysOverdue = ChronoUnit.DAYS.between(
                    borrowRecord.getDueDate(),
                    request.getReturnDate()
            );
            borrowRecord.setFineAmount(daysOverdue * FINE_PER_DAY);
        }

        borrowRecord.setStatus(BorrowStatus.RETURNED);

        Book book = borrowRecord.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);

       BorrowRecordDTO.Response borrowRecordResponse= convertToResponse(borrowRecord);

        return ApiResponse.<BorrowRecordDTO.Response >builder()
                .data(borrowRecordResponse)
                .statusCode(200)
                .status(ApiStatus.SUCCESS)
                .success(true)
                .message("Return Book Successfully")
                .build();
    }

    
    @Transactional(readOnly = true)
    public ApiResponse<List<BorrowRecordDTO.Response>> getAllBorrowRecords() {
        List<BorrowRecordDTO.Response> borrowRecordDTOResponseList = borrowRecordRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ApiResponse.<List<BorrowRecordDTO.Response>>builder()
                .data(borrowRecordDTOResponseList)
                .statusCode(200)
                .status(ApiStatus.SUCCESS)
                .success(true)
                .message("All borrow records retrieved successfully")
                .build();
    }
    
    @Transactional(readOnly = true)
    public ApiResponse<List<BorrowRecordDTO.Response>> getBorrowRecordsByUserId(Long userId) {
        List<BorrowRecordDTO.Response> borrowRecordDTOResponseList = borrowRecordRepository.findByUserId(userId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ApiResponse.<List<BorrowRecordDTO.Response>>builder()
                .data(borrowRecordDTOResponseList)
                .statusCode(200)
                .status(ApiStatus.SUCCESS)
                .success(true)
                .message("Borrow records for user retrieved successfully")
                .build();
    }
    
    @Transactional(readOnly = true)
    public ApiResponse<List<BorrowRecordDTO.Response>> getActiveBorrowRecords(Long userId) {
        List<BorrowRecordDTO.Response> borrowRecordDTOResponseList = borrowRecordRepository.findByUserIdAndStatus(userId, String.valueOf(BorrowStatus.BORROWED)).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ApiResponse.<List<BorrowRecordDTO.Response>>builder()
                .data(borrowRecordDTOResponseList)
                .statusCode(200)
                .status(ApiStatus.SUCCESS)
                .success(true)
                .message("All borrow records retrieved successfully")
                .build();
    }
    
    @Transactional
    public void updateOverdueRecords() {
        List<BorrowRecord> borrowedRecords = borrowRecordRepository.findByStatus(String.valueOf(BorrowStatus.BORROWED));
        LocalDate today = LocalDate.now();
        
        for (BorrowRecord record : borrowedRecords) {
            if (record.getDueDate().isBefore(today)) {
                record.setStatus(BorrowStatus.OVERDUE);
                borrowRecordRepository.save(record);
            }
        }
    }
    @Transactional
        public ApiResponse<Void> deleteBorrowRecord(Long id) {
            BorrowRecord borrowRecord = borrowRecordRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Borrow record not found with id: " + id));

            if (borrowRecord.getStatus() == BorrowStatus.BORROWED) {
                Book book = borrowRecord.getBook();
                book.setAvailableCopies(book.getAvailableCopies() + 1);
                bookRepository.save(book);
            }

            borrowRecordRepository.delete(borrowRecord);
            return ApiResponse.<Void>builder()
                    .statusCode(200)
                    .status(ApiStatus.SUCCESS)
                    .success(true)
                    .message("Borrow record deleted successfully")
                    .build();
        }

    private BorrowRecordDTO.Response convertToResponse(BorrowRecord record) {
        return BorrowRecordDTO.Response.builder()
                .id(record.getId())
                .userId(record.getUser().getId())
                .username(record.getUser().getUsername())
                .bookId(record.getBook().getId())
                .bookTitle(record.getBook().getTitle())
                .bookAuthor(record.getBook().getAuthor())
                .borrowDate(record.getBorrowDate())
                .dueDate(record.getDueDate())
                .returnDate(record.getReturnDate())
                .returned(record.getStatus() == BorrowStatus.RETURNED)
                .fineAmount(record.getFineAmount())
                .notes(record.getNotes())
                .createdAt(record.getCreatedAt())
                .updatedAt(record.getUpdatedAt())
                .createdBy(record.getCreatedBy())
                .updatedBy(record.getUpdatedBy())
                .build();
    }

}
