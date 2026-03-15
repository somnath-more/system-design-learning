package com.library.service.impl;

import com.library.dto.ApiResponse;
import com.library.dto.UserDTO;
import com.library.entity.User;
import com.library.enums.Role;
import com.library.exception.BadRequestException;
import com.library.exception.ResourceNotFoundException;
import com.library.repository.UserRepository;
import com.library.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
       return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

    }

    @Transactional(readOnly = true)
    public ApiResponse<List<UserDTO>> getAllUsers() {
        log.info("S->Fetching all users");
        List<UserDTO> userDTOS= userRepository.findAll().stream()
                .map(user -> modelMapper.map(user, UserDTO.class))
                .collect(Collectors.toList());
        return ApiResponse.<List<UserDTO>>builder()
                .statusCode(200)
                .status(com.library.enums.ApiStatus.SUCCESS)
                .success(true)
                .data(userDTOS)
                .message("Users retrieved successfully")
                .build();
    }
    
    @Transactional(readOnly = true)
    public ApiResponse<UserDTO> getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return ApiResponse.<UserDTO>builder()
                .statusCode(200)
                .status(com.library.enums.ApiStatus.SUCCESS)
                .success(true)
                .data(modelMapper.map(user, UserDTO.class))
                .message("User retrieved successfully")
                .build();
    }
    
    @Transactional(readOnly = true)
    public ApiResponse<UserDTO> getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        return ApiResponse.<UserDTO>builder()
                .statusCode(200)
                .status(com.library.enums.ApiStatus.SUCCESS)
                .success(true)
                .data(modelMapper.map(user, UserDTO.class))
                .message("User retrieved successfully by username")
                .build();
    }
    
    @Transactional
    public ApiResponse<UserDTO> createUser(UserDTO userDTO) {
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new BadRequestException("Username already exists");
        }
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new BadRequestException("Email already exists");
        }
        
        User user = modelMapper.map(userDTO, User.class);
        user.setPassword("encoded");
        user.setActive(true);
        
        User savedUser = userRepository.save(user);
        return ApiResponse.<UserDTO>builder()
                .statusCode(200)
                .status(com.library.enums.ApiStatus.SUCCESS)
                .success(true)
                .data(modelMapper.map(savedUser, UserDTO.class))
                .message("User created successfully")
                .build();
    }
    
    @Transactional
    public ApiResponse<UserDTO> updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        if (!user.getEmail().equals(userDTO.getEmail()) && 
            userRepository.existsByEmail(userDTO.getEmail())) {
            throw new BadRequestException("Email already exists");
        }
        
        user.setEmail(userDTO.getEmail());
        user.setFullName(userDTO.getFullName());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user.setAddress(userDTO.getAddress());
        user.setRole(userDTO.getRole());
        user.setActive(userDTO.getActive());
        
        User updatedUser = userRepository.save(user);
        return ApiResponse.<UserDTO>builder()
                .statusCode(200)
                .status(com.library.enums.ApiStatus.SUCCESS)
                .success(true)
                .data(modelMapper.map(updatedUser, UserDTO.class))
                .message("User retrieved successfully by username")
                .build();
    }
    
    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
    
    @Transactional(readOnly = true)
    public ApiResponse<List<UserDTO>> getUsersByRole(Role role) {
        List<UserDTO> userDTOS= userRepository.findByRole(role).stream()
                .map(user -> modelMapper.map(user, UserDTO.class))
                .collect(Collectors.toList());
        return ApiResponse.<List<UserDTO>>builder()
                .statusCode(200)
                .status(com.library.enums.ApiStatus.SUCCESS)
                .success(true)
                .data(userDTOS)
                .message("Users retrieved successfully for role: " + role)
                .build();
    }
}
