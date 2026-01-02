package com.tinyurl.backend.service;

import com.tinyurl.backend.dto.TinyServiceDto;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Optional;

public interface TinyService {
   Optional<String> shortenURL(TinyServiceDto tinyServiceDto);
    String redirect(String shortCode);
}
