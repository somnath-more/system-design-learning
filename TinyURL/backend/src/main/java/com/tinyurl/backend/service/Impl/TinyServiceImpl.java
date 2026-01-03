package com.tinyurl.backend.service.Impl;

import com.tinyurl.backend.dto.TinyServiceDto;
import com.tinyurl.backend.model.TinyUrl;
import com.tinyurl.backend.repository.TinyUrlRepository;
import com.tinyurl.backend.service.TinyService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

import static java.lang.Long.decode;

@Service
@RequiredArgsConstructor
@Slf4j
public class TinyServiceImpl implements TinyService {
    private final TinyUrlRepository tinyUrlRepository;
    private final Base62Service base62Service;
    @Override
    public Optional<String> shortenURL(TinyServiceDto tinyServiceDto) {

        // 1. Save to database
        TinyUrl tinyUrl = TinyUrl.builder()
                .originalUrl(tinyServiceDto.getOriginalUrl())
                .build();
        TinyUrl tinyUrl1= tinyUrlRepository.save(tinyUrl);
        return Optional.of(base62Service.encode(tinyUrl1.getId()));
    }


    @Override
    public String redirect(String shortCode) {
        log.info("Received shortCode: {}", shortCode);
        long id = base62Service.decode(shortCode); // decode Base62 to numeric ID
        log.info("Decoded ID from shortCode: {}", id);

        TinyUrl entity = tinyUrlRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("URL not found for code: " + shortCode));

        log.info("Redirecting to original URL: {}", entity.getOriginalUrl());
        return entity.getOriginalUrl();
    }

}
