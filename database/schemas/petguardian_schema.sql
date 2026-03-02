-- PetGuardian Database Schema
-- Initial schema creation

CREATE DATABASE IF NOT EXISTS petguardian;
USE petguardian;

-- Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('OWNER', 'VETERINARIAN', 'ADMIN') DEFAULT 'OWNER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Pets Table
CREATE TABLE pets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    owner_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    species VARCHAR(50),
    breed VARCHAR(100),
    date_of_birth DATE,
    gender ENUM('MALE', 'FEMALE', 'UNKNOWN'),
    weight DECIMAL(5,2),
    qr_code VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Vaccinations Table
CREATE TABLE vaccinations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pet_id BIGINT NOT NULL,
    vaccine_name VARCHAR(100) NOT NULL,
    administered_date DATE,
    next_due_date DATE,
    administered_by BIGINT,
    notes TEXT,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
    FOREIGN KEY (administered_by) REFERENCES users(id)
);

-- Medical Records Table
CREATE TABLE medical_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pet_id BIGINT NOT NULL,
    veterinarian_id BIGINT,
    visit_date DATE NOT NULL,
    diagnosis TEXT,
    treatment TEXT,
    prescription TEXT,
    follow_up_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
    FOREIGN KEY (veterinarian_id) REFERENCES users(id)
);
