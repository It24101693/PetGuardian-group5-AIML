-- Migration to upgrade image_url and profile_image_url columns to LONGTEXT
-- This fixes the "Data too long for column 'image_url'" error for large Base64 images

USE petguardian;

-- Upgrade image_url column in pets table
ALTER TABLE pets MODIFY COLUMN image_url LONGTEXT;

-- Upgrade profile_image_url in users table
ALTER TABLE users MODIFY COLUMN profile_image_url LONGTEXT;
