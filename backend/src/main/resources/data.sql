-- PetGuardian Initial Seed Data
USE petguardian;

-- 1. Initial Admin and Owners
INSERT IGNORE INTO users (username, email, password_hash, full_name, role, is_active, created_at) VALUES 
('admin', 'admin@petguardian.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOnu', 'Super Admin', 'ADMIN', 1, NOW()),
('owner1', 'owner1@example.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOnu', 'John Doe', 'OWNER', 1, NOW()),
('vet1', 'vet1@example.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOnu', 'Dr. Smith', 'VETERINARIAN', 1, NOW());

-- 2. Initial Pets
INSERT IGNORE INTO pets (owner_id, name, species, breed, date_of_birth, age, gender, status, created_at) VALUES 
(2, 'Max', 'Dog', 'Golden Retriever', '2020-05-15', 3, 'MALE', 'HEALTHY', NOW()),
(2, 'Bella', 'Cat', 'Persian', '2021-08-20', 2, 'FEMALE', 'VACCINE_DUE', NOW());

-- 3. Initial Veterinarians
INSERT IGNORE INTO vet (name, type, specialty, address, rating, reviews, phone, is_open, verified, ai_recommended) VALUES 
('City Pet Hospital', 'Hospital', 'General Surgery', '123 Main St, Central City', 4.8, 120, '555-0101', 1, 1, 1),
('Healthy Paws Clinic', 'Clinic', 'Dermatology', '456 Oak Ave, East Side', 4.5, 85, '555-0102', 1, 1, 0);

-- 4. Sample Notifications
INSERT IGNORE INTO notifications (user_id, title, message, type, is_read, created_at) VALUES 
(2, 'Welcome to PetGuardian!', 'Thank you for joining our community.', 'INFO', 1, NOW()),
(2, 'Vaccination Reminder: Bella', 'Bella is due for her Rabies vaccine on 2026-03-10.', 'VACCINATION', 0, NOW());

-- 5. Sample Knowledge Base
INSERT IGNORE INTO knowledge_base (keyword, response, category) VALUES 
('diet', 'A balanced diet for dogs should include proteins, healthy fats, and complex carbohydrates.', 'Nutrition'),
('exercise', 'Most adult dogs need at least 30 to 60 minutes of physical activity daily.', 'Activity');
