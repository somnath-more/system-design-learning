package com.library.service;

import com.library.dto.ApiResponse;
import com.library.dto.BorrowRecordDTO;

import java.util.List;

public interface BorrowService {
    public ApiResponse<BorrowRecordDTO.Response> borrowBook(BorrowRecordDTO.Request request);
    public ApiResponse<BorrowRecordDTO.Response> returnBook(Long borrowId, BorrowRecordDTO.ReturnRequest request);
    public ApiResponse<List<BorrowRecordDTO.Response>> getAllBorrowRecords();
    public ApiResponse<List<BorrowRecordDTO.Response>> getBorrowRecordsByUserId(Long userId);
    public ApiResponse<List<BorrowRecordDTO.Response>> getActiveBorrowRecords(Long userId);
     ApiResponse<Void> deleteBorrowRecord(Long id);
    }
