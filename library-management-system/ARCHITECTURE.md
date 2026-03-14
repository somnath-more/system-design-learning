# System Architecture

## Overview

The Library Management System follows a modern three-tier architecture with clear separation of concerns.

## Architecture Layers

### 1. Presentation Layer (Frontend)
- **Technology**: React 18 + TypeScript + Vite
- **Responsibilities**: 
  - User interface rendering
  - User input handling
  - State management
  - API communication
  
### 2. Application Layer (Backend)
- **Technology**: Spring Boot 3.2
- **Responsibilities**:
  - Business logic processing
  - Request/response handling
  - Authentication & Authorization
  - Data validation

### 3. Data Layer
- **Technology**: MySQL + JPA/Hibernate
- **Responsibilities**:
  - Data persistence
  - Transaction management
  - Query optimization

## Design Patterns

### Backend Patterns

1. **MVC (Model-View-Controller)**
   - Controllers handle HTTP requests
   - Services contain business logic
   - Repositories manage data access

2. **DTO Pattern**
   - Separate DTOs for API contracts
   - Entity-to-DTO mapping via ModelMapper
   - Prevents exposing internal structure

3. **Repository Pattern**
   - Spring Data JPA repositories
   - Custom query methods
   - Abstraction over data access

4. **Dependency Injection**
   - Constructor injection via Lombok @RequiredArgsConstructor
   - Spring manages bean lifecycle

5. **Global Exception Handling**
   - @RestControllerAdvice for centralized error handling
   - Custom exception types
   - Standardized error responses

6. **Auditing Pattern**
   - BaseEntity for common audit fields
   - @CreatedDate, @LastModifiedDate
   - @CreatedBy, @LastModifiedBy via AuditorAware

### Frontend Patterns

1. **Container/Presentational Components**
   - Smart components (pages)
   - Dumb components (UI elements)

2. **Custom Hooks**
   - Reusable logic extraction
   - Side effects management

3. **Service Layer**
   - API abstraction
   - Centralized HTTP logic

4. **State Management**
   - Zustand stores for global state
   - Local state for component-specific data

## Security Architecture

### Authentication Flow
1. User submits credentials
2. Backend validates and generates JWT
3. Frontend stores token in localStorage
4. Token sent in Authorization header for subsequent requests
5. Backend validates token on each request

### Authorization
- Role-based access control (RBAC)
- Method-level security via @PreAuthorize
- Frontend route guards

## Data Flow

### Book Borrowing Flow
1. User selects book from catalog
2. Frontend validates user's borrow limit
3. API request sent to backend
4. Backend validates:
   - User eligibility
   - Book availability
   - Borrow limit
5. Transaction created atomically:
   - Create borrow record
   - Update book available copies
6. Response sent to frontend
7. UI updated with success/error

## API Design

### RESTful Principles
- Resource-based URLs
- HTTP methods (GET, POST, PUT, DELETE)
- Stateless communication
- Standard status codes

### Request/Response Format
```json
// Success Response
{
  "id": 1,
  "title": "Clean Code",
  "author": "Robert Martin",
  ...
}

// Error Response
{
  "timestamp": "2024-02-13T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Book not available",
  "path": "/api/borrow-records"
}
```

## Scalability Considerations

1. **Database**
   - Indexing on frequently queried fields
   - Connection pooling
   - Query optimization

2. **Backend**
   - Stateless design for horizontal scaling
   - Caching layer (Redis - future enhancement)
   - Rate limiting (future enhancement)

3. **Frontend**
   - Code splitting
   - Lazy loading
   - CDN for static assets

## Monitoring & Logging

- **Backend**: SLF4J with Logback
- **Frontend**: Console logging in development
- **Future**: ELK stack integration

## Deployment Architecture

```
[User Browser] 
    ↓
[Cloudflare CDN] (Future)
    ↓
[Nginx/Apache] → [React Frontend]
    ↓
[Spring Boot API]
    ↓
[MySQL Database]
```

## Technology Decisions

### Why Spring Boot?
- Enterprise-grade framework
- Rich ecosystem
- Built-in security
- Easy configuration

### Why React + TypeScript?
- Component-based architecture
- Strong typing with TypeScript
- Large community
- Rich ecosystem

### Why MySQL?
- ACID compliance
- Proven reliability
- Good performance
- Wide adoption

### Why JWT?
- Stateless authentication
- Scalable
- Mobile-friendly
- Industry standard
