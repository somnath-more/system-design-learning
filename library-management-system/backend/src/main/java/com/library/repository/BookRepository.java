package com.library.repository;

import com.library.dto.LibraryStatsDTO;
import com.library.entity.Book;
import com.library.enums.BookStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    Optional<Book> findByIsbn(String isbn);

    List<Book> findByTitleContainingIgnoreCase(String title);

    List<Book> findByAuthorContainingIgnoreCase(String author);

    List<Book> findByCategory(String category);

    List<Book> findByStatus(BookStatus status);

    @Query("SELECT b FROM Book b WHERE " +
            "LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(b.isbn) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Book> searchBooks(@Param("keyword") String keyword);

    @Query("SELECT DISTINCT b.category FROM Book b WHERE b.category IS NOT NULL")
    List<String> findAllCategories();

    //    Total books
    @Query("SELECT COUNT(b) FROM Book b")
    long countTotalBooks();

    // BY STATUS COUNT
    @Query("SELECT COUNT(b) FROM Book b WHERE b.status = :status")
    long countBooksByStatus(@Param("status") BookStatus status);


//    @Query("""
//            SELECT new com.yourpackage.dto.LibraryStatsDTO(
//                COUNT(b),
//                SUM(CASE WHEN b.status = 'AVAILABLE' THEN 1 ELSE 0 END),
//                SUM(CASE WHEN b.status = 'BORROWED' THEN 1 ELSE 0 END),
//                (SELECT COUNT(br) FROM BorrowRecord br
//                    WHERE br.returnDate IS NULL AND br.dueDate < CURRENT_DATE)
//            )
//            FROM Book b
//            """)
//    LibraryStatsDTO getLibraryStats();
}
