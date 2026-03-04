package com.library.service;

import com.library.dto.AuthDTO;

public interface AuthService {
    AuthDTO.AuthResponse  register(AuthDTO.RegisterRequest request);
    AuthDTO.AuthResponse  login(AuthDTO.LoginRequest request);
//       void logout(String token);
}
