package com.tinyurl.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TinyServiceDto {
    @NotBlank(message = "Email is mandatory")
    private String originalUrl;

}