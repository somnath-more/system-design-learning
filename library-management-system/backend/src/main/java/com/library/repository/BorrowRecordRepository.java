package com.library.repository;

import com.library.entity.BorrowRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {
    
    List<BorrowRecord> findByUserId(Long userId);
    
    List<BorrowRecord> findByBookId(Long bookId);
    
    List<BorrowRecord> findByReturnedFalse();
    
    List<BorrowRecord> findByReturnedTrue();
    List<BorrowRecord> findByUserIdAndStatus(Long userId,String status);
    List<BorrowRecord> findByStatus(String status);
    @Query("SELECT br FROM BorrowRecord br WHERE br.user.id = :userId AND br.returned = false")
    List<BorrowRecord> findActiveRecordsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT br FROM BorrowRecord br WHERE br.book.id = :bookId AND br.returned = false")
    List<BorrowRecord> findActiveRecordsByBookId(@Param("bookId") Long bookId);
    
    @Query("SELECT br FROM BorrowRecord br WHERE br.returned = false AND br.dueDate < :currentDate")
    List<BorrowRecord> findOverdueRecords(@Param("currentDate") LocalDate currentDate);
    
    @Query("SELECT COUNT(br) FROM BorrowRecord br WHERE br.user.id = :userId AND br.returned = false")
    Long countActiveRecordsByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(br) FROM BorrowRecord br WHERE br.returnDate IS NULL AND br.dueDate < CURRENT_DATE")
    long countOverdueBooks();
}
