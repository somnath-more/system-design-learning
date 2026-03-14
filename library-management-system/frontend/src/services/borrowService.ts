import api from './api';
import { BorrowRecord, PaginatedBorrowResponse } from '../types';

export const borrowService = {
  // Get all borrow records
  getAllRecords: async (): Promise<PaginatedBorrowResponse<BorrowRecord>['data']> => {
    const response = await api.get<PaginatedBorrowResponse<BorrowRecord>>('/borrow-records');
    console.log("Data",response.data);

    return response.data.data;
  },

  // Get borrow record by ID
  getRecordById: async (id: number): Promise<BorrowRecord> => {
    const { data } = await api.get<BorrowRecord>(`/borrow-records/${id}`);
    return data;
  },

  // Get all records for a user
  getRecordsByUserId: async (userId: number): Promise<BorrowRecord[]> => {
    const { data } = await api.get<BorrowRecord[]>(`/borrow-records/user/${userId}`);
    
    return data;
  },

  // Get active (unreturned) records for a user
  getActiveRecordsByUserId: async (userId: number): Promise<BorrowRecord[]> => {
    const { data } = await api.get<BorrowRecord[]>(`/borrow-records/user/${userId}/active`);
    return data;
  },

  // Get overdue records
  getOverdueRecords: async (): Promise<BorrowRecord[]> => {
    const { data } = await api.get<BorrowRecord[]>('/borrow-records/overdue');
    return data;
  },

  // Borrow a book
  borrowBook: async (record: Partial<BorrowRecord>): Promise<BorrowRecord> => {
    const { data } = await api.post<BorrowRecord>('/borrow-records', record);
    return data;
  },

  // Return a book
  returnBook: async (id: number): Promise<BorrowRecord> => {
    const { data } = await api.put<BorrowRecord>(`/borrow-records/${id}/return`);
    return data;
  },

  // Update borrow record
  updateRecord: async (id: number, record: Partial<BorrowRecord>): Promise<BorrowRecord> => {
    const { data } = await api.put<BorrowRecord>(`/borrow-records/${id}`, record);
    return data;
  },

  // Delete borrow record
  deleteRecord: async (id: number): Promise<void> => {
    await api.delete(`/borrow-records/${id}`);
  },
};
