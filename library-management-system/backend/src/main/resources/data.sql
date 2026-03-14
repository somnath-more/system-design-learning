-- Insert default roles
INSERT INTO roles (name, description) VALUES ('ROLE_ADMIN', 'Administrator role with full access');
INSERT INTO roles (name, description) VALUES ('ROLE_LIBRARIAN', 'Librarian role for managing books');
INSERT INTO roles (name, description) VALUES ('ROLE_MEMBER', 'Member role for borrowing books');

-- Create default admin user (password: admin123)
-- Password is BCrypt hash of 'admin123'
INSERT INTO users (username, email, password, first_name, last_name, active, created_date, created_by) 
VALUES ('admin', 'admin@library.com', '$2a$10$1tQ8EWVzQ5wR9KhqYY4Pz.v3ZqG0P3p6gF8Hq0qYhqLRY4q1FqYhG', 'Admin', 'User', true, NOW(), 'system');

-- Assign admin role to admin user
INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'admin' AND r.name = 'ROLE_ADMIN';
