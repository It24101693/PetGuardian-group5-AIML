-- PetGuardian Database Schema
CREATE DATABASE IF NOT EXISTS petguardian;
USE petguardian;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150),
    phone_number VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'OWNER',
    profile_image_url LONGTEXT,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at DATETIME,
    updated_at DATETIME,
    last_login DATETIME
);

-- 2. Pets Table
CREATE TABLE IF NOT EXISTS pets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    owner_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    species VARCHAR(50) NOT NULL,
    breed VARCHAR(100),
    date_of_birth DATE,
    age INT,
    gender VARCHAR(20) DEFAULT 'UNKNOWN',
    weight DECIMAL(10, 2),
    color VARCHAR(50),
    microchip_number VARCHAR(50) UNIQUE,
    image_url LONGTEXT,
    qr_code VARCHAR(255) UNIQUE,
    status VARCHAR(20) DEFAULT 'HEALTHY',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME,
    updated_at DATETIME
);

-- 3. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    pet_name VARCHAR(255) NOT NULL,
    veterinarian_name VARCHAR(255) NOT NULL,
    appointment_time DATETIME NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    type VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. AI Symptom Scans Table
CREATE TABLE IF NOT EXISTS ai_symptom_scans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pet_id BIGINT NOT NULL,
    image_url LONGTEXT,
    disease_name VARCHAR(255),
    probability DOUBLE,
    severity VARCHAR(50),
    precautionary_advice TEXT,
    created_at DATETIME,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
);

-- 6. Pet Passports Table
CREATE TABLE IF NOT EXISTS pet_passports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pet_name VARCHAR(100) NOT NULL,
    species VARCHAR(50),
    breed VARCHAR(100),
    date_of_birth DATE,
    weight VARCHAR(20),
    color VARCHAR(100),
    owner_name VARCHAR(150) NOT NULL,
    owner_phone VARCHAR(50),
    vet_name VARCHAR(150),
    vet_clinic VARCHAR(150),
    vet_phone VARCHAR(50),
    blood_type VARCHAR(20),
    microchip_id VARCHAR(100),
    known_drug_allergies VARCHAR(1000),
    current_medications VARCHAR(1000),
    special_instructions LONGTEXT,
    emergency_contact VARCHAR(150),
    created_at DATETIME NOT NULL
);

-- 7. Vaccinations Table
CREATE TABLE IF NOT EXISTS vaccinations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    passport_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    date DATE,
    next_due DATE,
    provider VARCHAR(150),
    batch_no VARCHAR(100),
    notes VARCHAR(1000),
    status VARCHAR(50),
    FOREIGN KEY (passport_id) REFERENCES pet_passports(id) ON DELETE CASCADE
);

-- 8. Allergies Table
CREATE TABLE IF NOT EXISTS allergies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    passport_id BIGINT NOT NULL,
    type VARCHAR(50),
    name VARCHAR(150) NOT NULL,
    severity VARCHAR(50),
    notes VARCHAR(1000),
    FOREIGN KEY (passport_id) REFERENCES pet_passports(id) ON DELETE CASCADE
);

-- 9. Medical Records Table
CREATE TABLE IF NOT EXISTS medical_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    passport_id BIGINT NOT NULL,
    date DATE,
    type VARCHAR(50),
    title VARCHAR(200) NOT NULL,
    description VARCHAR(2000),
    veterinarian VARCHAR(150),
    FOREIGN KEY (passport_id) REFERENCES pet_passports(id) ON DELETE CASCADE
);

-- 10. Medical Record Medications (Collection Table)
CREATE TABLE IF NOT EXISTS medical_record_medications (
    record_id BIGINT NOT NULL,
    medication VARCHAR(255),
    FOREIGN KEY (record_id) REFERENCES medical_records(id) ON DELETE CASCADE
);

-- 11. Veterinarians Table
CREATE TABLE IF NOT EXISTS vet (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    specialty VARCHAR(255),
    address VARCHAR(255),
    rating DOUBLE,
    reviews INT,
    phone VARCHAR(50),
    is_open BOOLEAN,
    verified BOOLEAN,
    ai_recommended BOOLEAN,
    latitude DOUBLE,
    longitude DOUBLE
);

-- 12. Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content VARCHAR(2000) NOT NULL,
    sender_id VARCHAR(255) NOT NULL,
    receiver_id VARCHAR(255) NOT NULL,
    timestamp DATETIME NOT NULL,
    is_ai BOOLEAN DEFAULT FALSE
);

-- 13. Community Posts Table
CREATE TABLE IF NOT EXISTS community_posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content VARCHAR(1000) NOT NULL,
    author_id BIGINT NOT NULL,
    author_name VARCHAR(255),
    author_avatar TEXT,
    timestamp DATETIME NOT NULL,
    likes INT DEFAULT 0,
    comments INT DEFAULT 0,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 14. Knowledge Base Table
CREATE TABLE IF NOT EXISTS knowledge_base (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    keyword VARCHAR(255) NOT NULL UNIQUE,
    response VARCHAR(2000) NOT NULL,
    category VARCHAR(255)
);
