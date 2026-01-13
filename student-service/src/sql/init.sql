-- Student Service Database Initialization
CREATE DATABASE IF NOT EXISTS student_db;
USE student_db;

-- Students Table
CREATE TABLE IF NOT EXISTS students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    address TEXT,
    enrollment_date DATE DEFAULT (CURRENT_DATE),
    status ENUM('active', 'inactive', 'graduated') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_email (email),
    INDEX idx_student_id (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Sample Data
INSERT INTO students (student_id, first_name, last_name, email, phone, date_of_birth, address, status) VALUES
('ST001', 'John', 'Doe', 'john.doe@school.edu', '123-456-7890', '2000-01-15', '123 Main Street, Cityville', 'active'),
('ST002', 'Jane', 'Smith', 'jane.smith@school.edu', '987-654-3210', '2001-03-22', '456 Oak Avenue, Townsville', 'active'),
('ST003', 'Robert', 'Johnson', 'robert.j@school.edu', '555-123-4567', '1999-11-30', '789 Pine Road, Villageton', 'graduated'),
('ST004', 'Emily', 'Williams', 'emily.w@school.edu', '555-987-6543', '2000-05-10', '321 Elm Street, Hamlet City', 'active'),
('ST005', 'Michael', 'Brown', 'michael.b@school.edu', '444-222-1111', '2002-08-17', '654 Maple Lane, Borough Town', 'inactive');

-- Create user for application
CREATE USER IF NOT EXISTS 'student_app'@'%' IDENTIFIED BY 'student_password';
GRANT ALL PRIVILEGES ON student_db.* TO 'student_app'@'%';
FLUSH PRIVILEGES;