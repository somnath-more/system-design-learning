package com.library.service.impl;

import com.library.dto.AuthorDTO;
import com.library.entity.Author;
import com.library.exception.ResourceNotFoundException;
import com.library.repository.AuthorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthorService {

    private final AuthorRepository authorRepository;


    @Transactional
    public AuthorDTO.Response createAuthor(AuthorDTO.Request request) {
        Author author = Author.builder()
                .name(request.getName())
                .biography(request.getBiography())
                .nationality(request.getNationality())
                .birthYear(request.getBirthYear())
                .build();

        Author savedAuthor = authorRepository.save(author);
        return convertToResponse(savedAuthor);
    }

    @Transactional(readOnly = true)
    public AuthorDTO.Response getAuthorById(Long id) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found with id: " + id));
        return convertToResponse(author);
    }

    @Transactional(readOnly = true)
    public List<AuthorDTO.Response> getAllAuthors() {
        return authorRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AuthorDTO.Response updateAuthor(Long id, AuthorDTO.Request request) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found with id: " + id));

        author.setName(request.getName());
        author.setBiography(request.getBiography());
        author.setNationality(request.getNationality());
        author.setBirthYear(request.getBirthYear());

        Author updatedAuthor = authorRepository.save(author);
        return convertToResponse(updatedAuthor);
    }

    @Transactional
    public void deleteAuthor(Long id) {
        if (!authorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Author not found with id: " + id);
        }
        authorRepository.deleteById(id);
    }

    private AuthorDTO.Response convertToResponse(Author author) {
        return AuthorDTO.Response.builder()
                .id(author.getId())
                .name(author.getName())
                .biography(author.getBiography())
                .nationality(author.getNationality())
                .birthYear(author.getBirthYear())
                .createdAt(author.getCreatedAt())
                .updatedAt(author.getUpdatedAt())
                .build();
    }
}
