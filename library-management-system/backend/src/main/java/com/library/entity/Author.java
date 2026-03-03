package com.library.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "authors")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Author extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "name",nullable = false)
    private String name;
    @Column(name = "biography",nullable = false)
    private String biography;
    @Column(name = "nationality",nullable = false)
    private String nationality;
    @Column(name = "birthYear",nullable = false)
    private String birthYear;

}
