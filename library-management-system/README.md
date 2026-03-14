# Library Management System

A full-stack Library Management System built with Spring Boot, MySQL, React, TypeScript, and Vite.

## 🚀 Features

### Backend (Spring Boot)
- **Authentication & Authorization**: JWT-based authentication with role-based access control (ADMIN, LIBRARIAN, MEMBER)
- **User Management**: Complete CRUD operations for users with audit tracking
- **Book Management**: Comprehensive book catalog with search, categories, and availability tracking
- **Borrow Records**: Track book borrowing with due dates, returns, and fine calculations
- **RESTful APIs**: Well-structured REST endpoints following best practices
- **Global Exception Handling**: Centralized error handling with meaningful error responses
- **DTO Pattern**: Data Transfer Objects for clean API contracts
- **Audit Trail**: Automatic tracking of created/updated dates and users
- **Atomic Transactions**: ACID compliance for data integrity

### Frontend (React + TypeScript)
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- **Type Safety**: Full TypeScript implementation for better developer experience
- **State Management**: Zustand for efficient global state management
- **Form Handling**: React Hook Form with validation
- **API Integration**: Axios with interceptors for authentication
- **Toast Notifications**: Real-time user feedback
- **Routing**: React Router for navigation
- **Protected Routes**: Route guards based on authentication

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- Node.js 18+ and npm
- Git

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Security**: Spring Security with JWT
- **Database**: MySQL
- **ORM**: Spring Data JPA / Hibernate
- **Validation**: Jakarta Validation
- **Documentation**: OpenAPI/Swagger (can be added)
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Form Management**: React Hook Form
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## 📁 Project Structure

```
library-management-system/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/library/
│   │   │   │   ├── config/          # Configuration classes
│   │   │   │   ├── controller/      # REST controllers
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── entity/          # JPA entities
│   │   │   │   ├── enums/           # Enum types
│   │   │   │   ├── exception/       # Custom exceptions & handlers
│   │   │   │   ├── repository/      # Data repositories
│   │   │   │   ├── security/        # Security configuration
│   │   │   │   ├── service/         # Business logic
│   │   │   │   └── util/            # Utility classes
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
└── frontend/
    ├── src/
    │   ├── components/      # Reusable UI components
    │   ├── pages/           # Page components
    │   ├── services/        # API service layer
    │   ├── context/         # State management
    │   ├── types/           # TypeScript types
    │   ├── hooks/           # Custom React hooks
    │   ├── utils/           # Utility functions
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── public/
    ├── package.json
    ├── vite.config.ts
    └── tailwind.config.js
```

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd library-management-system
```

### 2. Database Setup
```sql
-- Create database
CREATE DATABASE library_db;

-- Or let Spring Boot create it automatically with:
-- spring.jpa.hibernate.ddl-auto=create
```

### 3. Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Update `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/library_db?createDatabaseIfNotExist=true
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
```

3. Build and run:
```bash
mvn clean install
mvn spring-boot:run
```

Backend will start on `http://localhost:8080`

### 4. Frontend Setup

1. Navigate to frontend directory:
```bash
cd ../frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend will start on `http://localhost:5173`

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - Get all users (ADMIN, LIBRARIAN)
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/username/{username}` - Get user by username
- `PUT /api/users/{id}` - Update user (ADMIN)
- `DELETE /api/users/{id}` - Delete user (ADMIN)

### Books
- `GET /api/books` - Get all books
- `GET /api/books/{id}` - Get book by ID
- `GET /api/books/isbn/{isbn}` - Get book by ISBN
- `GET /api/books/search?keyword=` - Search books
- `GET /api/books/category/{category}` - Get books by category
- `GET /api/books/categories` - Get all categories
- `POST /api/books` - Create book (ADMIN, LIBRARIAN)
- `PUT /api/books/{id}` - Update book (ADMIN, LIBRARIAN)
- `DELETE /api/books/{id}` - Delete book (ADMIN)

### Borrow Records
- `GET /api/borrow-records` - Get all records (ADMIN, LIBRARIAN)
- `GET /api/borrow-records/{id}` - Get record by ID
- `GET /api/borrow-records/user/{userId}` - Get user's records
- `GET /api/borrow-records/user/{userId}/active` - Get active records
- `GET /api/borrow-records/overdue` - Get overdue records
- `POST /api/borrow-records` - Borrow book
- `PUT /api/borrow-records/{id}/return` - Return book
- `PUT /api/borrow-records/{id}` - Update record
- `DELETE /api/borrow-records/{id}` - Delete record (ADMIN)

## 👥 User Roles

1. **ADMIN**: Full system access
   - Manage users, books, and records
   - Delete operations
   - View all data

2. **LIBRARIAN**: Library operations
   - Manage books and borrow records
   - Process borrowing and returns
   - View overdue records

3. **MEMBER**: Basic user access
   - Browse books
   - Borrow books
   - View own borrow history

## 🔑 Default Credentials

After running the application, you can create users through the registration endpoint:

```json
{
  "username": "admin",
  "email": "admin@library.com",
  "password": "admin123",
  "role": "ADMIN"
}
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🏗️ Build for Production

### Backend
```bash
cd backend
mvn clean package
java -jar target/library-management-system-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm run build
# Serve the dist folder with your preferred web server
```

## 📊 Database Schema

### Users Table
- id (PK)
- username (unique)
- email (unique)
- password (encrypted)
- full_name
- phone_number
- address
- role (ADMIN/LIBRARIAN/MEMBER)
- active
- created_at, updated_at
- created_by, updated_by

### Books Table
- id (PK)
- isbn (unique)
- title
- author
- publisher
- publication_year
- description
- category
- shelf_location
- total_copies
- available_copies
- status (AVAILABLE/BORROWED/RESERVED/MAINTENANCE)
- cover_image_url
- created_at, updated_at
- created_by, updated_by

### Borrow_Records Table
- id (PK)
- user_id (FK)
- book_id (FK)
- borrow_date
- due_date
- return_date
- returned
- fine_amount
- notes
- created_at, updated_at
- created_by, updated_by

## 🔒 Security Features

- JWT token-based authentication
- Password encryption using BCrypt
- CORS configuration for frontend integration
- Role-based access control (@PreAuthorize)
- SQL injection prevention (JPA/Hibernate)
- XSS protection
- CSRF protection (disabled for API, can be enabled)

## 📱 Frontend Features

- Responsive design (mobile-friendly)
- Protected routes
- Automatic token refresh
- Loading states
- Error handling
- Form validation
- Toast notifications
- Dark mode ready (can be implemented)

## 🚀 Future Enhancements

- [ ] Email notifications for due dates
- [ ] Fine payment integration
- [ ] Book reservations
- [ ] Advanced search filters
- [ ] Reading history and recommendations
- [ ] Export reports (PDF, Excel)
- [ ] Barcode scanning for books
- [ ] Multi-language support
- [ ] Book reviews and ratings
- [ ] Analytics dashboard
- [ ] Cloudflare integration for CDN
- [ ] Docker containerization
- [ ] Kubernetes deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Your Name

## 📞 Support

For support, email support@library.com or create an issue in the repository.
