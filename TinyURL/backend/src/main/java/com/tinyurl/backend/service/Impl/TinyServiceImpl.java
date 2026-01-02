package com.tinyurl.backend.service.Impl;

import com.tinyurl.backend.dto.TinyServiceDto;
import com.tinyurl.backend.model.TinyUrl;
import com.tinyurl.backend.repository.TinyUrlRepository;
import com.tinyurl.backend.service.TinyService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

import static java.lang.Long.decode;

@Service
@RequiredArgsConstructor
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


    public String redirect(String shortCode) {
        // Convert the short string back to a numeric ID
        long id = decode(shortCode);

        // Find the record or throw an error if the code doesn't exist
        TinyUrl entity = tinyUrlRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("URL not found for code: " + shortCode));

        return entity.getOriginalUrl();
    }
}
