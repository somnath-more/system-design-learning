# Quick Start Guide

Get the Library Management System running in 5 minutes!

## Prerequisites Check

```bash
# Check Java version (need 17+)
java --version

# Check Maven
mvn --version

# Check MySQL
mysql --version

# Check Node.js (need 18+)
node --version

# Check npm
npm --version
```

## Step 1: Clone & Navigate

```bash
git clone <repository-url>
cd library-management-system
```

## Step 2: Setup Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE library_db;
exit;
```

## Step 3: Configure Backend

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

## Step 4: Start Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

✅ Backend running at `http://localhost:8080`

## Step 5: Start Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend running at `http://localhost:5173`

## Step 6: Create First User

### Using the UI:
1. Open browser at `http://localhost:5173`
2. Click "Register"
3. Fill in details:
   - Username: `admin`
   - Email: `admin@library.com`
   - Password: `admin123`
   - Role: Select `ADMIN`
4. Click Register

### Using API (Alternative):

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@library.com",
    "password": "admin123",
    "fullName": "System Administrator",
    "role": "ADMIN"
  }'
```

## Step 7: Login & Explore!

1. Login with your credentials
2. Add some books
3. Create borrow records
4. Explore the dashboard

## Default Test Data (Optional)

Add test books via API:

```bash
# Get your token first by logging in, then:

curl -X POST http://localhost:8080/api/books \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isbn": "978-0-13-468599-1",
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "publisher": "Prentice Hall",
    "publicationYear": 2008,
    "category": "Programming",
    "totalCopies": 5,
    "status": "AVAILABLE"
  }'
```

## Troubleshooting

### Backend won't start?
- Check MySQL is running: `sudo systemctl status mysql`
- Verify database exists: `mysql -u root -p -e "SHOW DATABASES;"`
- Check port 8080 is free: `lsof -i :8080`

### Frontend won't start?
- Clear node_modules: `rm -rf node_modules && npm install`
- Check port 5173 is free: `lsof -i :5173`

### Can't connect frontend to backend?
- Ensure CORS is configured in `SecurityConfig.java`
- Check proxy in `vite.config.ts`
- Verify backend is running

## What's Next?

- Read [README.md](README.md) for full documentation
- Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API reference
- See [ARCHITECTURE.md](ARCHITECTURE.md) for system design
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for production setup

## Need Help?

- Check existing issues
- Create a new issue with:
  - Error message
  - Steps to reproduce
  - System information

Happy coding! 🚀
