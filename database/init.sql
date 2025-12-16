-- PostgreSQL Database Initialization Script for EduConnect
-- Migrated from MySQL database_seed.sql

-- Create tables
CREATE TABLE IF NOT EXISTS students (
    student_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
    course_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    credits SMALLINT NOT NULL CHECK (credits > 0),
    lecturer VARCHAR(120) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS enrollments (
    enrollment_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade VARCHAR(2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_enroll_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_enroll_course FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- Insert seed data for students
INSERT INTO students (name, email) VALUES
('Alya Pratama', 'alya.pratama@educonnect.id'),
('Bagus Saputra', 'bagus.saputra@educonnect.id'),
('Citra Lestari', 'citra.lestari@educonnect.id');

-- Insert seed data for courses
INSERT INTO courses (title, credits, lecturer) VALUES
('Pemrograman Web Lanjut', 3, 'Dr. Nirmala Sari'),
('Sistem Terdistribusi', 4, 'Ir. Damar Wibowo'),
('Data Mining', 3, 'Dr. Surya Ananta');

-- Insert seed data for enrollments
INSERT INTO enrollments (student_id, course_id, grade) VALUES
(1, 1, 'A'),
(1, 2, 'B+'),
(2, 2, 'A-'),
(3, 3, 'B');
