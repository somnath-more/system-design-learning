package com.library.entity;

import com.library.enums.BorrowStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "borrow_records")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class BorrowRecord extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;
    
    @Column(name = "borrow_date", nullable = false)
    private LocalDate borrowDate;
    
    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;
    
    @Column(name = "return_date")
    private LocalDate returnDate;
    
    @Column(nullable = false)
    private Boolean returned = false;
    
    @Column(name = "fine_amount")
    private Double fineAmount = 0.0;
    
    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BorrowStatus status;


}
