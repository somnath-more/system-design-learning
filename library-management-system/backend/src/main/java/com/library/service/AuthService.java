package com.library.service;

import com.library.dto.AuthDTO;

public interface AuthService {
    AuthDTO.AuthResponse  register(AuthDTO.RegisterRequest request);
    String login(String username, String password);
    void logout(String token);
}
