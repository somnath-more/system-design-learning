package com.tinyurl.backend.exception;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ErrorResponse {
    private int statusCode;
    private String message;
    private long timestamp;
    private String path;
}
