package com.tinyurl.backend.controller;

import com.tinyurl.backend.dto.TinyServiceDto;
import com.tinyurl.backend.service.TinyService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Optional;

@RestController
@RequestMapping("/tinyurl")
@RequiredArgsConstructor
public class TinyUrlController {
     private final TinyService tinyService;
    @PostMapping("/shorten")
    public ResponseEntity<Optional<String>> shortenURL(@Valid @RequestBody TinyServiceDto tinyServiceDto){

        return ResponseEntity.status(HttpStatus.OK).body(tinyService.shortenURL(tinyServiceDto));
    }
    @GetMapping("/{shortCode}")
    public RedirectView redirect(@PathVariable String shortCode) {
        String targetUrl = tinyService.redirect(shortCode);
        return new RedirectView(targetUrl);
    }
}
