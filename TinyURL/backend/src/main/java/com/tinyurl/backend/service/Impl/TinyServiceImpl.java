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
    private final RedisCacheService redisCacheService;
    @Override
    public Optional<String> shortenURL(TinyServiceDto tinyServiceDto) {

        // 1. Save to database
        TinyUrl tinyUrl = TinyUrl.builder()
                .originalUrl(tinyServiceDto.getOriginalUrl())
                .build();
        TinyUrl saveUrl= tinyUrlRepository.save(tinyUrl);
        // Encode to Base62 shortCode
        String shortCode = base62Service.encode(saveUrl.getId());
        // Save in Redis
        redisCacheService.saveUrl(shortCode, tinyServiceDto.getOriginalUrl());
        return Optional.of(shortCode);
    }


    @Override
    public String redirect(String shortCode) {
        // 1. Check Redis first
        String cachedUrl = redisCacheService.getUrl(shortCode);
        if (cachedUrl != null) {
            log.info("URL found in Redis cache: {}", cachedUrl);
            return cachedUrl;
        }

        // 2. Decode shortCode to numeric ID
        long id = base62Service.decode(shortCode);
        log.info("Decoded ID: {}", id);

        // 3. Fetch from DB if not in Redis
        TinyUrl entity = tinyUrlRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("URL not found for code: " + shortCode));

        String originalUrl = entity.getOriginalUrl();
        // 4. Save to Redis for future requests
        redisCacheService.saveUrl(shortCode, originalUrl);

        log.info("URL saved to Redis cache: {}", originalUrl);
        return originalUrl;
    }

}
