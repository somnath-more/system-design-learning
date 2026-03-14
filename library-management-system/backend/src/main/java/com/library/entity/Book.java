package com.library.entity;

import com.library.enums.BookStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "books")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Book extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String isbn;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    private String author;
    
    private String publisher;
    
    @Column(name = "publication_year")
    private Integer publicationYear;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String category;
    
    @Column(name = "shelf_location")
    private String shelfLocation;
    
    @Column(name = "total_copies", nullable = false)
    private Integer totalCopies;
    
    @Column(name = "available_copies", nullable = false)
    private Integer availableCopies;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookStatus status;
    
    @Column(name = "cover_image_url")
    private String coverImageUrl;
    
    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<BorrowRecord> borrowRecords;
}
