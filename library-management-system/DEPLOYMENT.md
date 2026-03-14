# Deployment Guide

## Local Development

### Prerequisites
- Java 17+
- Maven 3.6+
- MySQL 8.0+
- Node.js 18+
- npm or yarn

### Steps

1. **Database Setup**
```bash
mysql -u root -p
CREATE DATABASE library_db;
```

2. **Backend**
```bash
cd backend
# Update application.properties with your MySQL credentials
mvn spring-boot:run
```

3. **Frontend**
```bash
cd frontend
npm install
npm run dev
```

## Production Deployment

### Option 1: Traditional Server Deployment

#### Backend Deployment

1. **Build JAR**
```bash
cd backend
mvn clean package -DskipTests
```

2. **Configure Production Properties**
Create `application-prod.properties`:
```properties
spring.datasource.url=jdbc:mysql://your-db-host:3306/library_db
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=validate
jwt.secret=${JWT_SECRET}
```

3. **Run Application**
```bash
java -jar -Dspring.profiles.active=prod target/library-management-system-1.0.0.jar
```

4. **Setup as System Service** (Linux)
Create `/etc/systemd/system/library-api.service`:
```ini
[Unit]
Description=Library Management API
After=syslog.target network.target

[Service]
User=library
ExecStart=/usr/bin/java -jar /opt/library/library-management-system.jar
SuccessExitStatus=143
Environment="SPRING_PROFILES_ACTIVE=prod"
Environment="DB_USERNAME=your_user"
Environment="DB_PASSWORD=your_password"
Environment="JWT_SECRET=your_secret"

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable library-api
sudo systemctl start library-api
```

#### Frontend Deployment

1. **Build Production Bundle**
```bash
cd frontend
npm run build
```

2. **Deploy with Nginx**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/library/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

3. **Setup SSL with Let's Encrypt**
```bash
sudo certbot --nginx -d yourdomain.com
```

### Option 2: Docker Deployment

1. **Create Backend Dockerfile**
```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
```

2. **Create Frontend Dockerfile**
```dockerfile
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

3. **Create docker-compose.yml**
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: library_db
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/library_db
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: rootpassword
      JWT_SECRET: your-secret-key
    depends_on:
      - mysql

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mysql_data:
```

4. **Deploy**
```bash
docker-compose up -d
```

### Option 3: Cloud Deployment (AWS)

#### Backend (Elastic Beanstalk)
1. Package application
2. Create Elastic Beanstalk application
3. Configure RDS for MySQL
4. Deploy JAR file

#### Frontend (S3 + CloudFront)
1. Build production bundle
2. Upload to S3 bucket
3. Configure CloudFront distribution
4. Update API proxy settings

### Option 4: Heroku Deployment

#### Backend
```bash
# Create Heroku app
heroku create library-api

# Add MySQL addon
heroku addons:create jawsdb:kitefin

# Set environment variables
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main
```

#### Frontend
```bash
# Create Heroku app
heroku create library-frontend

# Configure buildpack
heroku buildpacks:add heroku/nodejs

# Deploy
git push heroku main
```

## Cloudflare Integration

### Setup Steps

1. **Add Site to Cloudflare**
   - Sign up at cloudflare.com
   - Add your domain
   - Update nameservers

2. **Configure DNS**
```
Type: A
Name: @
Content: your-server-ip

Type: A
Name: api
Content: your-server-ip
```

3. **SSL/TLS Settings**
   - Set to "Full (strict)"
   - Enable "Always Use HTTPS"

4. **Page Rules**
```
URL: yourdomain.com/api/*
Settings: Cache Level = Bypass
```

5. **Performance Optimization**
   - Enable Auto Minify (JS, CSS, HTML)
   - Enable Brotli compression
   - Configure caching rules

## Database Migration

### Production Database Setup

1. **Initial Setup**
```sql
CREATE DATABASE library_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'library_user'@'%' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON library_db.* TO 'library_user'@'%';
FLUSH PRIVILEGES;
```

2. **Enable Flyway for Migrations** (Future Enhancement)
Add to pom.xml:
```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

## Environment Variables

### Backend
```bash
export DB_URL=jdbc:mysql://localhost:3306/library_db
export DB_USERNAME=library_user
export DB_PASSWORD=secure_password
export JWT_SECRET=your-256-bit-secret-key
export JWT_EXPIRATION=86400000
```

### Frontend
```bash
export VITE_API_URL=https://api.yourdomain.com
```

## Health Checks

### Backend Health Endpoint
Add Spring Actuator:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

Access at: `http://localhost:8080/actuator/health`

## Monitoring

### Application Monitoring
- Setup Spring Boot Admin
- Configure Prometheus + Grafana
- Setup alerts

### Log Management
- Configure log rotation
- Centralize logs (ELK stack)
- Setup error tracking (Sentry)

## Backup Strategy

### Database Backups
```bash
# Daily backup
mysqldump -u root -p library_db > backup_$(date +%Y%m%d).sql

# Restore
mysql -u root -p library_db < backup_20240213.sql
```

### Automated Backups
Setup cron job:
```cron
0 2 * * * /usr/local/bin/backup-library-db.sh
```

## Security Checklist

- [ ] Change default passwords
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Setup rate limiting
- [ ] Enable SQL injection protection
- [ ] Configure firewall rules
- [ ] Setup DDoS protection (Cloudflare)
- [ ] Regular security updates
- [ ] Implement logging and monitoring

## Performance Optimization

1. **Database**
   - Add indexes on frequently queried columns
   - Configure connection pooling
   - Enable query caching

2. **Backend**
   - Enable response compression
   - Implement caching (Redis)
   - Optimize JVM settings

3. **Frontend**
   - Enable code splitting
   - Optimize images
   - Use CDN (Cloudflare)
   - Enable lazy loading

## Troubleshooting

### Backend Won't Start
- Check MySQL connection
- Verify Java version
- Check application logs
- Ensure ports are available

### Frontend Build Fails
- Clear node_modules and reinstall
- Check Node.js version
- Verify TypeScript configuration

### Database Connection Issues
- Check firewall rules
- Verify credentials
- Test network connectivity
- Check MySQL service status
