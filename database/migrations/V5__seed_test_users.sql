-- Seed script to insert the default user with ID 1
-- This is needed because the mock frontend expects a user with ID 1 to exist

USE petguardian;

-- Insert Sarah Johnson (default owner)
INSERT INTO users (id, username, email, password_hash, full_name, role, email_verified)
VALUES (1, 'sara', 'sara@example.com', '$2a$10$dummyhash', 'Sarah Johnson', 'OWNER', TRUE)
ON DUPLICATE KEY UPDATE full_name='Sarah Johnson';

-- Insert a veterinarian if needed
INSERT INTO users (id, username, email, password_hash, full_name, role, email_verified)
VALUES (2, 'dr_emily', 'emily@example.com', '$2a$10$dummyhash', 'Dr. Emily Martinez', 'VETERINARIAN', TRUE)
ON DUPLICATE KEY UPDATE full_name='Dr. Emily Martinez';
