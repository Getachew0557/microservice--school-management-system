-- Teacher Service Database Initialization
CREATE DATABASE IF NOT EXISTS teacher_db;
USE teacher_db;

-- Teachers Table
CREATE TABLE IF NOT EXISTS teachers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    address TEXT,
    department VARCHAR(100),
    hire_date DATE DEFAULT (CURRENT_DATE),
    status ENUM('active', 'on_leave', 'retired') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_department (department),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Sample Data
INSERT INTO teachers (teacher_id, first_name, last_name, email, phone, department, status) VALUES
('TCH001', 'Sarah', 'Johnson', 'sarah.j@school.edu', '111-222-3333', 'Mathematics', 'active'),
('TCH002', 'David', 'Miller', 'david.m@school.edu', '444-555-6666', 'Science', 'active'),
('TCH003', 'Lisa', 'Anderson', 'lisa.a@school.edu', '777-888-9999', 'English', 'on_leave'),
('TCH004', 'James', 'Wilson', 'james.w@school.edu', '123-987-4567', 'History', 'active'),
('TCH005', 'Maria', 'Garcia', 'maria.g@school.edu', '555-444-3333', 'Computer Science', 'active');

-- Create user for application
CREATE USER IF NOT EXISTS 'teacher_app'@'%' IDENTIFIED BY 'teacher_password';
GRANT ALL PRIVILEGES ON teacher_db.* TO 'teacher_app'@'%';
FLUSH PRIVILEGES;