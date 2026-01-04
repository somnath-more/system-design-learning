package com.tinyurl.backend.service.Impl;

import org.springframework.stereotype.Service;

@Service
public class Base62Service {
    private static final String ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    public String encode(Long id) {
        StringBuilder sb = new StringBuilder();
        while (id > 0) {
            sb.append(ALPHABET.charAt((int) (id % 62)));
            id /= 62;
        }
        return sb.reverse().toString();
    }
    public long decode(String shortCode) {
        long id = 0;
        for (char c : shortCode.toCharArray()) {
            int index = ALPHABET.indexOf(c);
            if (index == -1) throw new IllegalArgumentException("Invalid shortCode: " + shortCode);
            id = id * 62 + index;
        }
        System.out.println("Decoded shortCode " + shortCode + " to ID: " + id);
        return id;
    }
}
