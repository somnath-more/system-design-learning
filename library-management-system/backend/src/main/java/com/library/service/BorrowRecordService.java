package com.library.service;

import com.library.dto.ApiResponse;
import com.library.dto.BorrowRecordDTO;

import java.util.List;

public interface BorrowRecordService {
//    void borrowBook(Long userId, Long bookId);
     ApiResponse<BorrowRecordDTO> borrowBook(BorrowRecordDTO recordDTO);

    ApiResponse<BorrowRecordDTO> returnBook(Long recordId);
     ApiResponse<List<BorrowRecordDTO>> getActiveRecordsByUserId(Long userId);

    ApiResponse<List<BorrowRecordDTO>> getAllRecords();

    ApiResponse<List<BorrowRecordDTO>> getRecordsByUserId(Long userId);
    ApiResponse<List<BorrowRecordDTO>> getOverdueRecords() ;
    ApiResponse<List<BorrowRecordDTO>> getRecordsByBookId(Long bookId);

    ApiResponse<BorrowRecordDTO> getRecordById(Long id);
    ApiResponse<BorrowRecordDTO> updateRecord(Long id, BorrowRecordDTO recordDTO);

    ApiResponse<Object> deleteRecord(Long id);
}
