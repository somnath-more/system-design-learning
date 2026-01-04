package com.tinyurl.backend.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@RequiredArgsConstructor
@Service
public class RedisCacheService {
    private final RedisTemplate<String, String> redisTemplate;
    // Save URL in Redis with optional TTL (e.g., 1 day)
    public void saveUrl(String shortCode, String originalUrl) {
        redisTemplate.opsForValue().set(shortCode, originalUrl, 1, TimeUnit.DAYS);

    }
    // Get URL from Redis
    public String getUrl(String shortCode){
        return redisTemplate.opsForValue().get(shortCode);
    }
}
