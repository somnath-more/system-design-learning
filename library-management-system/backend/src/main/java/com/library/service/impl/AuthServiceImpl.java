package com.library.service.impl;

import com.library.config.JwtUtil;
import com.library.dto.AuthDTO;
import com.library.entity.User;
import com.library.enums.Role;
import com.library.exception.BadRequestException;
import com.library.repository.UserRepository;
import com.library.service.AuthService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
//import org.springframework.security.authentication.AuthenticationManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
//    private final AuthenticationManager authenticationManager;
    
    @Transactional
    public AuthDTO.AuthResponse register(AuthDTO.RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .role(request.getRole() != null ? request.getRole() : Role.MEMBER)
                .active(true)
                .build();

        User savedUser = userRepository.save(user);
        log.info("Registered new user: {}", savedUser.getUsername());
        String token = jwtUtil.generateToken(savedUser);

        return AuthDTO.AuthResponse.builder()
                .token(token)
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .build();
    }
    
    public AuthDTO.AuthResponse login(AuthDTO.LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadRequestException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid username or password");
        }

        String token = jwtUtil.generateToken(user);
        log.info("User logged in: {}", user.getUsername());

        return AuthDTO.AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .build();

    }
}
