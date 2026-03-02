-- Combined Migration to upgrade all URL and large text columns across the system
-- This prevents "Data too long" errors for Base64 images and large attachments

USE petguardian;

-- 1. Upgrade URL columns to LONGTEXT
ALTER TABLE pets MODIFY COLUMN image_url LONGTEXT;
ALTER TABLE users MODIFY COLUMN profile_image_url LONGTEXT;
ALTER TABLE community_posts MODIFY COLUMN image_url LONGTEXT;
ALTER TABLE medical_documents MODIFY COLUMN file_url LONGTEXT;

-- 2. Upgrade text/note columns for better capacity
ALTER TABLE pet_passports MODIFY COLUMN special_instructions LONGTEXT;
ALTER TABLE pet_passports MODIFY COLUMN known_drug_allergies TEXT;
ALTER TABLE pet_passports MODIFY COLUMN current_medications TEXT;
ALTER TABLE vaccinations MODIFY COLUMN notes TEXT;
ALTER TABLE allergies MODIFY COLUMN notes TEXT;

-- 3. Verify Sara user exists for frontend compatibility
INSERT INTO users (id, username, email, password_hash, full_name, role, email_verified)
VALUES (1, 'sara', 'sara@example.com', '$2a$10$dummyhash', 'Sarah Johnson', 'OWNER', TRUE)
ON DUPLICATE KEY UPDATE full_name='Sarah Johnson';
