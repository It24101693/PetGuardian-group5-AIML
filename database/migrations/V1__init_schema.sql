-- V1__init_schema.sql
-- Flyway migration: initial database setup

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('OWNER', 'VETERINARIAN', 'ADMIN') DEFAULT 'OWNER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
