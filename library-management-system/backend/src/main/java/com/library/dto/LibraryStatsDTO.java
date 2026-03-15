package com.library.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LibraryStatsDTO {

    private Long totalBooks;
    private Long availableBooks;
    private Long borrowedBooks;
    private Long dueBooks;
    private Long returnedBooks;

}