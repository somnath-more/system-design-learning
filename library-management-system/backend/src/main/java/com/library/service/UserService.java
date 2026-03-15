package com.library.service;

import com.library.dto.ApiResponse;
import com.library.dto.UserDTO;
import com.library.entity.User;
import com.library.enums.Role;

import java.util.List;

public interface UserService {
    ApiResponse<List<UserDTO>> getAllUsers();
    ApiResponse<UserDTO> updateUser(Long id, UserDTO userDTO);
    ApiResponse<UserDTO> getUserByUsername(String username);
    ApiResponse<UserDTO> getUserById(Long id);
        void deleteUser(Long userId);
    User loadUserByUsername(String username);
    ApiResponse<List<UserDTO>> getUsersByRole(Role role) ;

}
