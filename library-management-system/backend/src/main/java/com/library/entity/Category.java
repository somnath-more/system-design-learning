package com.library.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity(name = "categories")
@NoArgsConstructor
@Builder
@AllArgsConstructor
@Getter
@Setter
public class Category extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;
    private String description;
}
