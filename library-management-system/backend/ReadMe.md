# Enhanced Entity-Relationship Diagram
## With Separate Author and Category Tables

This document describes the **enhanced database schema** with normalized Author and Category tables for better data integrity and management.

---

## 📊 Enhanced ER Diagram (Text Representation)

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS TABLE                              │
├─────────────────────────────────────────────────────────────────┤
│ PK │ id                BIGINT AUTO_INCREMENT                     │
│ UK │ username          VARCHAR(50) UNIQUE NOT NULL               │
│ UK │ email             VARCHAR(100) UNIQUE NOT NULL              │
│    │ password          VARCHAR(255) NOT NULL (encrypted)         │
│    │ full_name         VARCHAR(100)                              │
│    │ phone_number      VARCHAR(20)                               │
│    │ address           TEXT                                      │
│    │ role              ENUM('ADMIN','LIBRARIAN','MEMBER')        │
│    │ active            BOOLEAN DEFAULT TRUE                      │
│    │ created_at        TIMESTAMP NOT NULL                        │
│    │ updated_at        TIMESTAMP                                 │
│    │ created_by        VARCHAR(50)                               │
│    │ updated_by        VARCHAR(50)                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 1
                              │
                              │ has
                              │
                              │ N
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BORROW_RECORDS TABLE                          │
├─────────────────────────────────────────────────────────────────┤
│ PK │ id                BIGINT AUTO_INCREMENT                     │
│ FK │ user_id           BIGINT NOT NULL → users(id)               │
│ FK │ book_id           BIGINT NOT NULL → books(id)               │
│    │ borrow_date       DATE NOT NULL                             │
│    │ due_date          DATE NOT NULL                             │
│    │ return_date       DATE                                      │
│    │ returned          BOOLEAN DEFAULT FALSE                     │
│    │ fine_amount       DECIMAL(10,2) DEFAULT 0.00                │
│    │ notes             TEXT                                      │
│    │ created_at        TIMESTAMP NOT NULL                        │
│    │ updated_at        TIMESTAMP                                 │
│    │ created_by        VARCHAR(50)                               │
│    │ updated_by        VARCHAR(50)                               │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ N
                              │
                              │ has
                              │
                              │ 1
┌─────────────────────────────────────────────────────────────────┐
│                         BOOKS TABLE                              │
├─────────────────────────────────────────────────────────────────┤
│ PK │ id                BIGINT AUTO_INCREMENT                     │
│ UK │ isbn              VARCHAR(20) UNIQUE NOT NULL               │
│    │ title             VARCHAR(255) NOT NULL                     │
│ FK │ author_id         BIGINT NOT NULL → authors(id)             │
│ FK │ category_id       BIGINT NOT NULL → categories(id)          │
│    │ publisher         VARCHAR(255)                              │
│    │ publication_year  INT                                       │
│    │ description       TEXT                                      │
│    │ shelf_location    VARCHAR(50)                               │
│    │ total_copies      INT NOT NULL                              │
│    │ available_copies  INT NOT NULL                              │
│    │ status            ENUM('AVAILABLE','BORROWED',              │
│    │                        'RESERVED','MAINTENANCE')            │
│    │ cover_image_url   VARCHAR(500)                              │
│    │ created_at        TIMESTAMP NOT NULL                        │
│    │ updated_at        TIMESTAMP                                 │
│    │ created_by        VARCHAR(50)                               │
│    │ updated_by        VARCHAR(50)                               │
└─────────────────────────────────────────────────────────────────┘
            ▲                                       ▲
            │                                       │
            │ N                                     │ N
            │                                       │
            │ belongs to                            │ belongs to
            │                                       │
            │ 1                                     │ 1
            │                                       │
┌───────────────────────────────┐    ┌────────────────────────────────┐
│      AUTHORS TABLE            │    │      CATEGORIES TABLE          │
├───────────────────────────────┤    ├────────────────────────────────┤
│ PK │ id      BIGINT AUTO_INC  │    │ PK │ id      BIGINT AUTO_INC   │
│ UK │ name    VARCHAR(255)     │    │ UK │ name    VARCHAR(100)      │
│    │ bio     TEXT             │    │    │ description  TEXT          │
│    │ country VARCHAR(100)     │    │    │ parent_id   BIGINT        │
│    │ website VARCHAR(500)     │    │    │ (self-referencing FK)     │
│    │ created_at TIMESTAMP     │    │    │ created_at TIMESTAMP      │
│    │ updated_at TIMESTAMP     │    │    │ updated_at TIMESTAMP      │
│    │ created_by VARCHAR(50)   │    │    │ created_by VARCHAR(50)    │
│    │ updated_by VARCHAR(50)   │    │    │ updated_by VARCHAR(50)    │
└───────────────────────────────┘    └────────────────────────────────┘
            │                                       │
            │ 1                                     │ 1
            │                                       │
            │ has (optional)                        │ has (optional)
            │                                       │
            │ N                                     │ N
            ▼                                       ▼
┌───────────────────────────────┐    ┌────────────────────────────────┐
│   BOOK_AUTHORS TABLE          │    │   BOOK_CATEGORIES TABLE        │
│   (Many-to-Many Junction)     │    │   (Many-to-Many Junction)      │
├───────────────────────────────┤    ├────────────────────────────────┤
│ PK │ id      BIGINT AUTO_INC  │    │ PK │ id      BIGINT AUTO_INC   │
│ FK │ book_id    BIGINT        │    │ FK │ book_id    BIGINT         │
│ FK │ author_id  BIGINT        │    │ FK │ category_id BIGINT        │
│    │ author_order INT         │    │    │ is_primary BOOLEAN        │
│    │ (1=primary, 2=co-author) │    │    │ created_at TIMESTAMP      │
│    │ created_at TIMESTAMP     │    │    │ created_by VARCHAR(50)    │
│    │ created_by VARCHAR(50)   │    └────────────────────────────────┘
└───────────────────────────────┘
```

---

## 🔗 Enhanced Relationships

### 1. **User ↔ Borrow Records** (1:N)
- One user can have multiple borrow records
- FK: `borrow_records.user_id` → `users.id`
- Delete: RESTRICT, Update: CASCADE

### 2. **Book ↔ Borrow Records** (1:N)
- One book can have multiple borrow records
- FK: `borrow_records.book_id` → `books.id`
- Delete: RESTRICT, Update: CASCADE

### 3. **Author ↔ Books** (1:N or M:N)

#### **Option A: One-to-Many (Simplified)**
- One author can write multiple books
- One book has one primary author
- FK: `books.author_id` → `authors.id`
- Delete: RESTRICT, Update: CASCADE

#### **Option B: Many-to-Many (Advanced)**
- One author can write multiple books
- One book can have multiple authors (co-authors)
- Uses junction table: `book_authors`
- Supports author ordering (primary, co-author)

### 4. **Category ↔ Books** (1:N or M:N)

#### **Option A: One-to-Many (Simplified)**
- One category contains multiple books
- One book belongs to one category
- FK: `books.category_id` → `categories.id`
- Delete: RESTRICT, Update: CASCADE

#### **Option B: Many-to-Many (Advanced)**
- One category contains multiple books
- One book can belong to multiple categories
- Uses junction table: `book_categories`
- Supports hierarchical categories (parent_id)

### 5. **Category ↔ Category** (Self-Referencing 1:N)
- Categories can have subcategories
- FK: `categories.parent_id` → `categories.id`
- Example: Fiction → Science Fiction → Cyberpunk

---

## 📋 Complete Enhanced SQL Schema

### Option 1: Simplified (One-to-Many for Author & Category)

```sql
-- Create Database
CREATE DATABASE IF NOT EXISTS library_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE library_db;

-- Authors Table
CREATE TABLE authors (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE NOT NULL,
    bio TEXT,
    country VARCHAR(100),
    birth_year INT,
    website VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    
    INDEX idx_name (name),
    INDEX idx_country (country)
) ENGINE=InnoDB;

-- Categories Table (with hierarchical support)
CREATE TABLE categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    
    FOREIGN KEY (parent_id) REFERENCES categories(id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    
    INDEX idx_name (name),
    INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB;

-- Users Table
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone_number VARCHAR(20),
    address TEXT,
    role ENUM('ADMIN', 'LIBRARIAN', 'MEMBER') NOT NULL,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_active (active)
) ENGINE=InnoDB;

-- Books Table (with foreign keys to authors and categories)
CREATE TABLE books (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    isbn VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    author_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    publisher VARCHAR(255),
    publication_year INT,
    description TEXT,
    shelf_location VARCHAR(50),
    total_copies INT NOT NULL,
    available_copies INT NOT NULL,
    status ENUM('AVAILABLE', 'BORROWED', 'RESERVED', 'MAINTENANCE') NOT NULL,
    cover_image_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    
    FOREIGN KEY (author_id) REFERENCES authors(id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    INDEX idx_isbn (isbn),
    INDEX idx_title (title),
    INDEX idx_author_id (author_id),
    INDEX idx_category_id (category_id),
    INDEX idx_status (status),
    FULLTEXT idx_search (title, isbn)
) ENGINE=InnoDB;

-- Borrow Records Table
CREATE TABLE borrow_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    borrow_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    returned BOOLEAN DEFAULT FALSE NOT NULL,
    fine_amount DECIMAL(10,2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    
    FOREIGN KEY (user_id) REFERENCES users(id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_book_id (book_id),
    INDEX idx_returned (returned),
    INDEX idx_due_date (due_date),
    INDEX idx_borrow_date (borrow_date)
) ENGINE=InnoDB;
```

## 🎯 Relationship Summary

### **Simplified Approach (Recommended for Initial Implementation)**

```
USERS (1) ────────< has >──────── (N) BORROW_RECORDS
                                        │
                                        │
BOOKS (1) ────────< has >───────────────┘ (N)
  │
  ├── (N) belongs to (1) AUTHOR
  └── (N) belongs to (1) CATEGORY
              │
              └── (N) child of (1) CATEGORY (hierarchical)
```

### **Advanced Approach (For Complex Requirements)**

```
USERS (1) ────────< has >──────── (N) BORROW_RECORDS
                                        │
                                        │
BOOKS (1) ────────< has >───────────────┘ (N)
  │
  ├── (N) ──< BOOK_AUTHORS >── (N) AUTHORS
  └── (N) ──< BOOK_CATEGORIES >── (N) CATEGORIES
                                        │
                                        └── (N) child of (1) CATEGORY
```

---

## 📊 Cardinality Details

### **Authors ↔ Books**

**Option A (1:N):**
- 1 Author → N Books
- 1 Book → 1 Author (primary)
- Min: 0 books per author (new author)
- Max: Unlimited books per author

**Option B (M:N):**
- N Authors → N Books
- Supports co-authors, editors, translators
- Primary author marked with `author_order = 1`

### **Categories ↔ Books**

**Option A (1:N):**
- 1 Category → N Books
- 1 Book → 1 Category
- Min: 0 books per category
- Max: Unlimited books per category

**Option B (M:N):**
- N Categories → N Books
- Book can be in multiple categories (e.g., Fiction + Mystery)
- Primary category marked with `is_primary = TRUE`

### **Categories ↔ Categories (Hierarchical)**
- 1 Parent Category → N Child Categories
- Supports unlimited depth (Fiction → Mystery → Detective)
- `parent_id = NULL` for top-level categories

---

## 🔍 Enhanced Queries

### Find all books by a specific author
```sql
-- Option A (1:N)
SELECT b.* 
FROM books b
JOIN authors a ON b.author_id = a.id
WHERE a.name = 'Robert C. Martin';

-- Option B (M:N)
SELECT b.* 
FROM books b
JOIN book_authors ba ON b.id = ba.book_id
JOIN authors a ON ba.author_id = a.id
WHERE a.name = 'Robert C. Martin';
```

### Find all books in a category (including subcategories)
```sql
-- Hierarchical category search
WITH RECURSIVE category_tree AS (
    -- Base case: selected category
    SELECT id FROM categories WHERE name = 'Fiction'
    UNION ALL
    -- Recursive case: all subcategories
    SELECT c.id 
    FROM categories c
    JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT b.*
FROM books b
WHERE b.category_id IN (SELECT id FROM category_tree);
```

### Find all co-authors of a book
```sql
SELECT a.name, ba.author_order, ba.contribution_role
FROM authors a
JOIN book_authors ba ON a.id = ba.author_id
WHERE ba.book_id = ?
ORDER BY ba.author_order;
```

### Get category hierarchy path
```sql
-- Get full path: Programming > Java > Spring Boot
WITH RECURSIVE category_path AS (
    SELECT id, name, parent_id, name as path
    FROM categories
    WHERE id = ?
    UNION ALL
    SELECT c.id, c.name, c.parent_id, 
           CONCAT(c.name, ' > ', cp.path) as path
    FROM categories c
    JOIN category_path cp ON c.id = cp.parent_id
)
SELECT path FROM category_path 
WHERE parent_id IS NULL;
```

### Find books by multiple categories
```sql
SELECT b.*, GROUP_CONCAT(c.name) as categories
FROM books b
JOIN book_categories bc ON b.id = bc.book_id
JOIN categories c ON bc.category_id = c.id
WHERE b.id = ?
GROUP BY b.id;
```

---

## 💡 Advantages of Enhanced Schema

### **Separate Author Table:**
1. ✅ **Data Integrity**: No duplicate author names
2. ✅ **Rich Author Data**: Bio, country, website
3. ✅ **Easy Updates**: Update author info once, affects all books
4. ✅ **Author Management**: Track author statistics, popular authors
5. ✅ **Support Co-Authors**: M:N relationship when needed

### **Separate Category Table:**
1. ✅ **Hierarchical Structure**: Categories with subcategories
2. ✅ **Flexible Taxonomy**: Easy to reorganize categories
3. ✅ **Multiple Categories**: Books can belong to multiple genres
4. ✅ **Category Management**: Track category statistics
5. ✅ **Easy Filtering**: Browse by category hierarchy

### **Business Benefits:**
- Better search capabilities
- Author popularity tracking
- Category-based recommendations
- Support for complex book classifications
- Easier reporting and analytics

---

## 🚀 Migration Path

### **Phase 1: Current Simple Schema** ✅
- Books have `author` as VARCHAR
- Books have `category` as VARCHAR
- Quick to implement
- Good for MVP

### **Phase 2: Normalized with 1:N** 🎯 RECOMMENDED
- Add `authors` table
- Add `categories` table
- Migrate existing data
- Update application code
- Better data quality

### **Phase 3: Advanced M:N** 🔮 Future Enhancement
- Add `book_authors` junction table
- Add `book_categories` junction table
- Support complex relationships
- Advanced features

---

## 📝 Sample Data

```sql
-- Insert Authors
INSERT INTO authors (name, country, bio) VALUES
('Robert C. Martin', 'USA', 'Software engineer and author'),
('Martin Fowler', 'UK', 'Chief Scientist at ThoughtWorks'),
('Eric Evans', 'USA', 'Domain-Driven Design pioneer');

-- Insert Categories (hierarchical)
INSERT INTO categories (name, description, parent_id) VALUES
('Technology', 'Technology books', NULL),
('Programming', 'Programming books', 1),
('Java', 'Java programming', 2),
('Python', 'Python programming', 2),
('Fiction', 'Fiction books', NULL),
('Science Fiction', 'Sci-fi books', 5);

-- Insert Books (linking to authors and categories)
INSERT INTO books (isbn, title, author_id, category_id, total_copies, available_copies, status) VALUES
('978-0-13-468599-1', 'Clean Code', 1, 2, 5, 5, 'AVAILABLE'),
('978-0-13-475759-9', 'Refactoring', 2, 2, 3, 3, 'AVAILABLE'),
('978-0-32-112521-7', 'Domain-Driven Design', 3, 2, 4, 4, 'AVAILABLE');
```

---

This enhanced schema provides **maximum flexibility** while maintaining **data integrity** and **performance**! 🎯

// Axios Interceptor with JWT
✅ Auto-add token to all requests
✅ Handle 401 → Logout & redirect
✅ Handle 403 → Permission errors
✅ Handle 400 → Validation errors
✅ Network error handling