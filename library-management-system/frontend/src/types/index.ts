// Enums
export enum Role {
  ADMIN = 'ADMIN',
  LIBRARIAN = 'LIBRARIAN',
  MEMBER = 'MEMBER'
}

export enum BookStatus {
  AVAILABLE = 'AVAILABLE',
  BORROWED = 'BORROWED',
  RESERVED = 'RESERVED',
  MAINTENANCE = 'MAINTENANCE'
}

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  role: Role;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// Book Types
export interface Book {
  id: number;
  isbn: string;
  title: string;
  author: string;
  publisher?: string;
  publicationYear?: number;
  description?: string;
  category?: string;
  shelfLocation?: string;
  totalCopies: number;
  availableCopies: number;
  status: BookStatus;
  coverImageUrl?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}
// {
//     "statusCode": 200,
//     "status": "SUCCESS",
//     "success": true,
//     "data": {
//         "content": [],
//         "pageNumber": 1,
//         "pageSize": 10,
//         "totalElements": 3,
//         "totalPages": 1,
//         "last": true
//     },
//     "message": "Books retrieved successfully",
//     "timestamp": "2026-03-15T00:18:19.1779848"
// }
export interface PaginatedResponse<T> {
  data: {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  }
  message: string;
  timestamp: string;
}


// Borrow Record Types
export interface BorrowRecord {
  id: number;
  userId: number;
  username?: string;
  bookId: number;
  bookTitle?: string;
  bookAuthor?: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  returned: boolean;
  fineAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// {
//     "statusCode": 200,
//     "status": "SUCCESS",
//     "success": true,
//     "data": [
//         {
//             "id": 2,
//             "userId": 1,
//             "username": "somnath",
//             "bookId": 2,
//             "bookTitle": "Best Practise: Springboot",
//             "bookAuthor": "George C. Linde",
//             "borrowDate": "2024-02-13",
//             "dueDate": "2024-02-27",
//             "status": "OVERDUE",
//             "returnDate": "2026-03-05",
//             "returned": true,
//             "fineAmount": 737,
//             "notes": "Secod book borrowing this book",
//             "createdAt": "2026-03-04T22:52:47.748865",
//             "updatedAt": "2026-03-05T00:03:41.325235"
//         },
//         {
//             "id": 4,
//             "userId": 2,
//             "username": "member1",
//             "bookId": 2,
//             "bookTitle": "Best Practise: Springboot",
//             "bookAuthor": "George C. Linde",
//             "borrowDate": "2024-02-13",
//             "dueDate": "2024-02-27",
//             "status": "BORROWED",
//             "returned": false,
//             "fineAmount": 0,
//             "notes": "User 2 Second  book borrowing this book",
//             "createdAt": "2026-03-04T22:53:32.615879",
//             "updatedAt": "2026-03-04T22:53:32.615879"
//         }
//     ],
//     "message": "All records retrieved successfully",
//     "timestamp": "2026-03-15T01:17:14.2541755"
// }
export interface PaginatedBorrowResponse<T> {
  data: T[];
  message: string;
  timestamp: string;
  statusCode: number;
  status: string;
  success: boolean;
}

// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  role?: Role;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  role: Role;
}

// Error Response
export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  validationErrors?: Record<string, string>;
}

// Form Data Types
export interface BookFormData {
  isbn: string;
  title: string;
  author: string;
  publisher?: string;
  publicationYear?: number;
  description?: string;
  category?: string;
  shelfLocation?: string;
  totalCopies: number;
  status: BookStatus;
  coverImageUrl?: string;
}

export interface BorrowFormData {
  userId: number;
  bookId: number;
  borrowDate: string;
  dueDate: string;
  notes?: string;
}
