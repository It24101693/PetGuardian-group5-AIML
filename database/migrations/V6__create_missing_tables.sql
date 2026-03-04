-- V6__create_missing_tables.sql
-- Migration to add tables for AI Symptom Scanner and Vet features

CREATE TABLE IF NOT EXISTS ai_symptom_scans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pet_id BIGINT NOT NULL,
    image_url LONGTEXT,
    disease_name VARCHAR(255),
    probability DOUBLE,
    severity VARCHAR(50),
    precautionary_advice TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS vet (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    specialty VARCHAR(255),
    address VARCHAR(255),
    rating DOUBLE,
    reviews INT,
    phone VARCHAR(50),
    is_open BOOLEAN DEFAULT TRUE,
    verified BOOLEAN DEFAULT FALSE,
    ai_recommended BOOLEAN DEFAULT FALSE,
    latitude DOUBLE,
    longitude DOUBLE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
