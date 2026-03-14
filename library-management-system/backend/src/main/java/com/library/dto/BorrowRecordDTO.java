package com.library.dto;

import com.library.enums.BorrowStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BorrowRecordDTO {
    
    private Long id;
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    private String username;
    
    @NotNull(message = "Book ID is required")
    private Long bookId;
    
    private String bookTitle;
    private String bookAuthor;
    
    @NotNull(message = "Borrow date is required")
    private LocalDate borrowDate;
    
    @NotNull(message = "Due date is required")
    private LocalDate dueDate;
//    @NotNull(message = "Borrow status is required")
    private BorrowStatus status;
    
    private LocalDate returnDate;
    private Boolean returned;
    private Double fineAmount;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response{
        private Long id;
        private Long userId;
        private String username;
        private Long bookId;
        private String bookTitle;
        private String bookAuthor;
        private LocalDate borrowDate;
        private LocalDate dueDate;
        private LocalDate returnDate;
        private Boolean returned;
        private Double fineAmount;
        private String notes;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private String createdBy;
        private String updatedBy;
    }
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReturnRequest{
        private Long userId;
        private Long bookId;
        private BorrowStatus status;
        private String notes;
        private LocalDate returnDate;
    }

    @Data
    public static class Request {

        @NotNull(message = "User ID is required")
        private Long userId;

        @NotNull(message = "Book ID is required")
        private Long bookId;

        @NotNull(message = "Borrow date is required")
        private LocalDate borrowDate= LocalDate.now();

        @NotNull(message = "Due date is required")
        private LocalDate dueDate;

        private String notes;
    }


}
