package com.library.service;

import com.library.dto.UserDTO;
import com.library.entity.User;
import com.library.enums.Role;

import java.util.List;

public interface UserService {
    List<UserDTO> getAllUsers();
    UserDTO updateUser(Long id, UserDTO userDTO);
    UserDTO getUserByUsername(String username);
    UserDTO getUserById(Long id);
        void deleteUser(Long userId);
    User loadUserByUsername(String username);
    List<UserDTO> getUsersByRole(Role role) ;

}
