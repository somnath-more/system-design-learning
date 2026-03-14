import api from './api';
import { User, Role } from '../types';

export const userService = {
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    const { data } = await api.get<User[]>('/users');
    return data;
  },

  // Get user by ID
  getUserById: async (id: number): Promise<User> => {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  // Get user by username
  getUserByUsername: async (username: string): Promise<User> => {
    const { data } = await api.get<User>(`/users/username/${username}`);
    return data;
  },

  // Get users by role
  getUsersByRole: async (role: Role): Promise<User[]> => {
    const { data } = await api.get<User[]>(`/users/role/${role}`);
    return data;
  },

  // Update user
  updateUser: async (id: number, user: Partial<User>): Promise<User> => {
    const { data } = await api.put<User>(`/users/${id}`, user);
    return data;
  },

  // Delete user
  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
