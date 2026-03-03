package com.library.dto;

import com.library.enums.Role;
import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class CategoryDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String name;
        private String description;
        private LocalDateTime createdDate;
        private LocalDateTime updatedDate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        @NotBlank(message = "Category Name is required")
        @Size(min = 3, max = 50, message = "Category Name must be between 3 and 50 characters")
        private String name;

        @NotBlank(message = "Description is required")
        @Size(min = 3, max = 50, message = "Description must be between 3 and 50 characters")
        private String description;

    }

}
