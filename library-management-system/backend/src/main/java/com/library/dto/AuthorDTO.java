package com.library.dto;

import com.library.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
public class AuthorDTO {

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class Response {
            private Long id;
            private String name;
            private String password;
            private String biography;
            private String nationality;
            private String birthYear;
            private LocalDateTime createdAt;
            private LocalDateTime updatedAt;
        }

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class Request {
            @NotBlank(message = "Author Name is required")
            @Size(min = 3, max = 50, message = "Author Name must be between 3 and 50 characters")
            private String name;

            @NotBlank(message = "Biography is Required")
            private String biography;
            @NotBlank(message = "Nationality is Required")
            private String nationality;
            @NotBlank(message = "BirthYear is Required")
            private String birthYear;
            private LocalDateTime createdAt;
            private LocalDateTime updatedAt;

        }


}
