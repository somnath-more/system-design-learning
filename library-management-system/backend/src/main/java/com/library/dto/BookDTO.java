package com.library.dto;

import com.library.enums.BookStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookDTO {
    
    private Long id;
    
    @NotBlank(message = "ISBN is required")
    private String isbn;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Author is required")
    private String author;
    
    private String publisher;
    private Integer publicationYear;
    private String description;
    private String category;
    private String shelfLocation;
    
    @NotNull(message = "Total copies is required")
    @Min(value = 1, message = "Total copies must be at least 1")
    private Integer totalCopies;
    
    private Integer availableCopies;
    
    @NotNull(message = "Status is required")
    private BookStatus status;
    
    private String coverImageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
}
