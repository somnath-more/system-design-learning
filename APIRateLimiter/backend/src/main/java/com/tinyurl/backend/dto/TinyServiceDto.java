package com.tinyurl.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TinyServiceDto {
    @NotBlank(message = "Original is mandatory")
    private String originalUrl;

}