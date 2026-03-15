import api from './api';
import { User, Role, PaginatedUserResponse } from '../types';

export const userService = {
  // Get all users
  getAllUsers: async (): Promise<PaginatedUserResponse<User>['data']> => {
    const response = await api.get<PaginatedUserResponse<User>>('/users');
    return response.data.data;
  },

  // Get user by ID
  getUserById: async (id: number):  Promise<PaginatedUserResponse<User>['data']> => {
    const response = await api.get<PaginatedUserResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  // Get user by username
  getUserByUsername: async (username: string):  Promise<PaginatedUserResponse<User>['data']> => {
    const response = await api.get<PaginatedUserResponse<User>>(`/users/username/${username}`);
    return response.data.data;
  },

  // Get users by role
  getUsersByRole: async (role: Role): Promise<PaginatedUserResponse<User[]>['data']> => {
    const response = await api.get<PaginatedUserResponse<User[]>>(`/users/role/${role}`);
    return response.data.data;
  },

  // Update user
  updateUser: async (id: number, user: Partial<User>):  Promise<PaginatedUserResponse<User>['data']> => {
    const response = await api.put<PaginatedUserResponse<User>>(`/users/${id}`, user);
    return response.data.data;
  },

  // Delete user
  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
