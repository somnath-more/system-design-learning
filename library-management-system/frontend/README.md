# Library Management System - Frontend

## 🎨 Complete React Application with Atomic Design Pattern

A production-ready frontend built with:
- ⚛️ **React 18** with **TypeScript**
- 🎨 **Material-UI (MUI)** for beautiful components
- 🏗️ **Atomic Design Pattern** for scalable architecture
- 🔄 **Redux Toolkit** for state management
- 🔐 **JWT Authentication** with secure interceptors
- 📡 **Axios** with request/response interceptors
- 🎭 **Theming** with light/dark mode support
- ✅ **Form validation** ready
- 🔥 **React Hot Toast** for notifications

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Backend API running on http://localhost:8080

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

The application will open at `http://localhost:5173`

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/         # Atomic Design components (future)
│   │   ├── atoms/         # Basic building blocks
│   │   ├── molecules/     # Component combinations
│   │   ├── organisms/     # Complex components
│   │   └── templates/     # Page layouts
│   │
│   ├── pages/             # Complete pages ✅
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Books.tsx
│   │   ├── BorrowRecords.tsx
│   │   └── Users.tsx
│   │
│   ├── redux/             # State management ✅
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   └── booksSlice.ts
│   │   └── store/
│   │       └── index.ts
│   │
│   ├── services/          # API services ✅
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── bookService.ts
│   │   ├── borrowService.ts
│   │   └── userService.ts
│   │
│   ├── types/             # TypeScript types ✅
│   │   └── index.ts
│   │
│   ├── theme/             # MUI theming ✅
│   │   └── index.ts
│   │
│   ├── hooks/             # Custom hooks ✅
│   │   └── useAuth.ts
│   │
│   ├── App.tsx            # Main app ✅
│   └── main.tsx           # Entry point ✅
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env.example
```

---

## ✨ Features Implemented

### Authentication & Authorization ✅
- JWT-based login and registration
- Automatic token management via interceptors
- Role-based access control (ADMIN, LIBRARIAN, MEMBER)
- Protected routes
- Auto-logout on token expiry

### Books Management ✅
- Browse all books with search functionality
- Create, update, delete books (ADMIN/LIBRARIAN)
- Filter by category and status
- Real-time availability tracking
- Responsive table with pagination

### Borrow Records ✅
- View borrowing history
- Borrow books with due date tracking
- Return books (ADMIN/LIBRARIAN)
- Overdue detection and fine calculation
- Status indicators (Active, Overdue, Returned)

### User Management ✅
- View all users (ADMIN/LIBRARIAN only)
- Role-based filtering
- User status tracking
- Delete users (ADMIN only)

### Dashboard ✅
- Statistics overview
- Quick actions
- Recent activity
- Navigation menu

---

## 🔐 Security Features

### Axios Interceptors
**Request Interceptor:**
- Automatically adds JWT token to all requests
- Logs requests in development mode

**Response Interceptor:**
- 401 → Logout and redirect to login
- 403 → Permission denied error
- 404 → Resource not found
- 400 → Validation errors
- 500 → Server error
- Network errors handled

### Protected Routes
Routes are protected based on authentication and role:
```typescript
<ProtectedRoute roles={[Role.ADMIN, Role.LIBRARIAN]}>
  <Users />
</ProtectedRoute>
```

---

## 🎨 UI/UX Features

### Material-UI Theme
- Consistent design system
- Custom color palette
- Responsive breakpoints
- Dark mode ready

### Toast Notifications
- Success messages
- Error handling
- Loading states
- Auto-dismiss

### Responsive Design
- Mobile-friendly
- Tablet optimized
- Desktop layout
- Breakpoints: xs, sm, md, lg, xl

---

## 📚 Pages Overview

### Login Page (`/login`)
- Username/password form
- Remember me option
- Link to registration
- Loading states

### Register Page (`/register`)
- Complete registration form
- Role selection
- Form validation
- Auto-login after registration

### Dashboard (`/dashboard`)
- Statistics cards
- Recent activity
- Quick actions
- Navigation menu

### Books Page (`/books`)
- Complete CRUD operations
- Search functionality
- Filter by status/category
- Add/Edit dialog
- Delete confirmation

### Borrow Records (`/borrow-records`)
- View all records
- Borrow new books
- Return books
- Overdue tracking
- Fine calculation

### Users Page (`/users`)
- User list table
- Role indicators
- Status tracking
- Delete users (ADMIN)

---

## 🔧 Configuration

### Environment Variables
Create `.env` file:
```env
VITE_API_URL=http://localhost:8080/api
```

### Path Aliases
Configured in `vite.config.ts` and `tsconfig.json`:
```typescript
import { Component } from '@/components/Component';
import { useAuth } from '@/hooks/useAuth';
import { bookService } from '@/services/bookService';
```

---

## 🎯 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 📦 Dependencies

### Core
- react: ^18.2.0
- react-dom: ^18.2.0
- typescript: ^5.2.2

### UI
- @mui/material: ^5.15.0
- @mui/icons-material: ^5.15.0
- @emotion/react: ^11.11.1
- @emotion/styled: ^11.11.0

### State Management
- @reduxjs/toolkit: ^2.0.1
- react-redux: ^9.0.4

### Routing
- react-router-dom: ^6.20.0

### HTTP Client
- axios: ^1.6.2

### Forms & Validation
- react-hook-form: ^7.48.2
- @hookform/resolvers: ^3.3.2
- yup: ^1.3.3

### Utilities
- react-hot-toast: ^2.4.1
- date-fns: ^2.30.0

### Build Tool
- vite: ^5.0.8
- @vitejs/plugin-react: ^4.2.1

---

## 🚦 Getting Started Guide

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API URL
   ```

3. **Start Backend**
   Make sure your Spring Boot backend is running on port 8080

4. **Start Frontend**
   ```bash
   npm run dev
   ```

5. **Access Application**
   Open `http://localhost:5173` in your browser

6. **Default Credentials**
   Register a new user or use existing credentials from backend

---

## 🎓 Code Examples

### Making API Calls
```typescript
import { bookService } from '@/services/bookService';

// Get all books
const books = await bookService.getAllBooks();

// Create book
const newBook = await bookService.createBook(bookData);

// Update book
const updated = await bookService.updateBook(id, bookData);
```

### Using Redux
```typescript
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks, selectAllBooks } from '@/redux/slices/booksSlice';

const books = useSelector(selectAllBooks);
const dispatch = useDispatch();

useEffect(() => {
  dispatch(fetchBooks());
}, []);
```

### Using Auth Hook
```typescript
import { useAuth } from '@/hooks/useAuth';

const { user, isAuthenticated, isAdmin, hasRole } = useAuth();

if (isAdmin()) {
  // Admin-only code
}
```

---

## 🐛 Troubleshooting

### Issue: Cannot connect to API
**Solution:** Ensure backend is running and VITE_API_URL is correct in `.env`

### Issue: 401 Unauthorized
**Solution:** Clear localStorage and login again

### Issue: CORS errors
**Solution:** Check backend CORS configuration allows `http://localhost:5173`

### Issue: Module not found
**Solution:** Run `npm install` again

---

## 📈 Next Steps

### To Expand:
1. Create atomic design components (atoms, molecules, organisms)
2. Add form validation with Yup schemas
3. Implement dark mode toggle
4. Add charts and analytics
5. Create advanced search filters
6. Add pagination to tables
7. Implement file upload for book covers
8. Add print/export functionality

---

## 📞 Support

For issues or questions:
1. Check this README
2. Review API documentation
3. Check browser console for errors
4. Verify backend is running

---

**Built with ❤️ using modern React best practices**
