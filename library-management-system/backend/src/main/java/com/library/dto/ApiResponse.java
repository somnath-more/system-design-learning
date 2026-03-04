package com.library.dto;

import com.library.enums.ApiStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
//Generic Response Wrapper
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {

    private Integer statusCode;
    private ApiStatus status;
    private boolean success;
    private T data;
    private Object error;
    private Object message;
//    totalItems
    private Long totalItems;
//    private LocalDateTime timestamp= LocalDateTime.now(); // default value;
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
    public ApiResponse(int statusCode, ApiStatus status, boolean success, T data, Object error, Object message,Long totalItems) {
        this.statusCode = statusCode;
        this.status = status;
        this.success = success;
        this.data = data;
        this.error = error;
        this.message = message;
        this.totalItems = totalItems;
        this.timestamp = LocalDateTime.now();
    }


}