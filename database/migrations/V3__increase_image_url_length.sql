-- Migration to increase image_url column length
-- This fixes the "Data too long for column 'image_url'" error

USE petguardian;

-- Increase image_url column size in pets table
ALTER TABLE pets MODIFY COLUMN image_url TEXT;

-- Also update profile_image_url in users table for consistency
ALTER TABLE users MODIFY COLUMN profile_image_url TEXT;
