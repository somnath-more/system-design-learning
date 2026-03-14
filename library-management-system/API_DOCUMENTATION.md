# API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication

All endpoints except `/auth/login` and `/auth/register` require authentication via JWT token.

### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

---

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phoneNumber": "+1234567890",
  "address": "123 Main St",
  "role": "MEMBER"
}
```

**Response:** (201 Created)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "type": "Bearer",
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "role": "MEMBER"
}
```

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response:** (200 OK)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "type": "Bearer",
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "role": "MEMBER"
}
```

---

## User Endpoints

### Get All Users
```http
GET /api/users
```
**Authorization:** ADMIN, LIBRARIAN

**Response:** (200 OK)
```json
[
  {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "phoneNumber": "+1234567890",
    "address": "123 Main St",
    "role": "MEMBER",
    "active": true,
    "createdAt": "2024-02-13T10:00:00",
    "updatedAt": "2024-02-13T10:00:00"
  }
]
```

### Get User by ID
```http
GET /api/users/{id}
```

**Response:** (200 OK)
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "phoneNumber": "+1234567890",
  "address": "123 Main St",
  "role": "MEMBER",
  "active": true,
  "createdAt": "2024-02-13T10:00:00",
  "updatedAt": "2024-02-13T10:00:00"
}
```

### Update User
```http
PUT /api/users/{id}
```
**Authorization:** ADMIN

**Request Body:**
```json
{
  "email": "newemail@example.com",
  "fullName": "John Updated Doe",
  "phoneNumber": "+0987654321",
  "address": "456 New St",
  "role": "LIBRARIAN",
  "active": true
}
```

### Delete User
```http
DELETE /api/users/{id}
```
**Authorization:** ADMIN

**Response:** (204 No Content)

---

## Book Endpoints

### Get All Books
```http
GET /api/books
```

**Response:** (200 OK)
```json
[
  {
    "id": 1,
    "isbn": "978-0-13-468599-1",
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "publisher": "Prentice Hall",
    "publicationYear": 2008,
    "description": "A handbook of agile software craftsmanship",
    "category": "Programming",
    "shelfLocation": "A-12",
    "totalCopies": 5,
    "availableCopies": 3,
    "status": "AVAILABLE",
    "coverImageUrl": "https://example.com/cover.jpg",
    "createdAt": "2024-02-13T10:00:00",
    "updatedAt": "2024-02-13T10:00:00"
  }
]
```

### Get Book by ID
```http
GET /api/books/{id}
```

### Get Book by ISBN
```http
GET /api/books/isbn/{isbn}
```

### Search Books
```http
GET /api/books/search?keyword=clean
```

**Response:** Returns array of books matching the keyword

### Get Books by Category
```http
GET /api/books/category/{category}
```

### Get All Categories
```http
GET /api/books/categories
```

**Response:** (200 OK)
```json
["Programming", "Fiction", "Science", "History"]
```

### Create Book
```http
POST /api/books
```
**Authorization:** ADMIN, LIBRARIAN

**Request Body:**
```json
{
  "isbn": "978-0-13-468599-1",
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "publisher": "Prentice Hall",
  "publicationYear": 2008,
  "description": "A handbook of agile software craftsmanship",
  "category": "Programming",
  "shelfLocation": "A-12",
  "totalCopies": 5,
  "status": "AVAILABLE",
  "coverImageUrl": "https://example.com/cover.jpg"
}
```

**Response:** (201 Created)

### Update Book
```http
PUT /api/books/{id}
```
**Authorization:** ADMIN, LIBRARIAN

**Request Body:** Same as create

### Delete Book
```http
DELETE /api/books/{id}
```
**Authorization:** ADMIN

**Response:** (204 No Content)

---

## Borrow Record Endpoints

### Get All Records
```http
GET /api/borrow-records
```
**Authorization:** ADMIN, LIBRARIAN

**Response:** (200 OK)
```json
[
  {
    "id": 1,
    "userId": 1,
    "username": "johndoe",
    "bookId": 1,
    "bookTitle": "Clean Code",
    "bookAuthor": "Robert C. Martin",
    "borrowDate": "2024-02-13",
    "dueDate": "2024-02-27",
    "returnDate": null,
    "returned": false,
    "fineAmount": 0.0,
    "notes": "First time borrowing",
    "createdAt": "2024-02-13T10:00:00",
    "updatedAt": "2024-02-13T10:00:00"
  }
]
```

### Get Record by ID
```http
GET /api/borrow-records/{id}
```

### Get Records by User ID
```http
GET /api/borrow-records/user/{userId}
```

### Get Active Records by User ID
```http
GET /api/borrow-records/user/{userId}/active
```

### Get Overdue Records
```http
GET /api/borrow-records/overdue
```
**Authorization:** ADMIN, LIBRARIAN

### Borrow Book
```http
POST /api/borrow-records
```

**Request Body:**
```json
{
  "userId": 1,
  "bookId": 1,
  "borrowDate": "2024-02-13",
  "dueDate": "2024-02-27",
  "notes": "First time borrowing"
}
```

**Response:** (201 Created)

**Business Rules:**
- Maximum 5 active borrows per user
- Book must be available
- Due date typically 14 days from borrow date

### Return Book
```http
PUT /api/borrow-records/{id}/return
```
**Authorization:** ADMIN, LIBRARIAN

**Response:** (200 OK)
Returns updated record with:
- `returned: true`
- `returnDate: <current date>`
- `fineAmount: <calculated if overdue>`

**Fine Calculation:**
- $1.00 per day overdue

### Update Record
```http
PUT /api/borrow-records/{id}
```
**Authorization:** ADMIN, LIBRARIAN

**Request Body:**
```json
{
  "dueDate": "2024-03-01",
  "notes": "Extended due date"
}
```

### Delete Record
```http
DELETE /api/borrow-records/{id}
```
**Authorization:** ADMIN

**Response:** (204 No Content)

---

## Error Responses

### 400 Bad Request
```json
{
  "timestamp": "2024-02-13T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Username already exists",
  "path": "/api/auth/register"
}
```

### 401 Unauthorized
```json
{
  "timestamp": "2024-02-13T10:30:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid username or password",
  "path": "/api/auth/login"
}
```

### 403 Forbidden
```json
{
  "timestamp": "2024-02-13T10:30:00",
  "status": 403,
  "error": "Forbidden",
  "message": "You don't have permission to access this resource",
  "path": "/api/users/1"
}
```

### 404 Not Found
```json
{
  "timestamp": "2024-02-13T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Book not found with id: 999",
  "path": "/api/books/999"
}
```

### 422 Validation Error
```json
{
  "timestamp": "2024-02-13T10:30:00",
  "status": 400,
  "error": "Validation Failed",
  "message": "Invalid input data",
  "path": "/api/books",
  "validationErrors": {
    "isbn": "ISBN is required",
    "title": "Title is required",
    "author": "Author is required"
  }
}
```

---

## Rate Limiting

Currently not implemented. Future enhancement will include:
- 100 requests per minute per user
- 1000 requests per hour per IP

## Pagination

Future enhancement will support pagination:
```http
GET /api/books?page=0&size=20&sort=title,asc
```

## Versioning

API versioning (future enhancement):
```http
GET /api/v1/books
GET /api/v2/books
```
