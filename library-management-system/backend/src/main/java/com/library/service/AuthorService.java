package com.library.service;

import com.library.dto.AuthorDTO;

import java.util.List;

public interface AuthorService {
    AuthorDTO.Response createAuthor(AuthorDTO.Request request);
    AuthorDTO.Response getAuthorById(Long id);
    public List<AuthorDTO.Response> getAllAuthors();
    void deleteAuthor(Long id);
     AuthorDTO.Response updateAuthor(Long id, AuthorDTO.Request request);
}
