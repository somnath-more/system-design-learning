package com.library.controller;

import com.library.dto.AuthorDTO;
import com.library.service.impl.AuthorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/authors")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
class AuthorController {

    private final AuthorService authorService;

    @PostMapping
//    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<AuthorDTO.Response> createAuthor(@Valid @RequestBody AuthorDTO.Request request) {
        AuthorDTO.Response response = authorService.createAuthor(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuthorDTO.Response> getAuthorById(@PathVariable Long id) {
        AuthorDTO.Response response = authorService.getAuthorById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<AuthorDTO.Response>> getAllAuthors() {
        List<AuthorDTO.Response> responses = authorService.getAllAuthors();
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
//    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<AuthorDTO.Response> updateAuthor(
            @PathVariable Long id,
            @Valid @RequestBody AuthorDTO.Request request) {
        AuthorDTO.Response response = authorService.updateAuthor(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAuthor(@PathVariable Long id) {
        authorService.deleteAuthor(id);
        return ResponseEntity.noContent().build();
    }
}
