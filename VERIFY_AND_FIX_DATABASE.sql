-- Run this ENTIRE script in MySQL Workbench

USE petguardian;

-- Step 1: Check the ACTUAL table structure
SHOW CREATE TABLE pets;

-- Step 2: Force drop and recreate the column as TEXT
ALTER TABLE pets DROP COLUMN image_url;
ALTER TABLE pets ADD COLUMN image_url TEXT AFTER microchip_number;

-- Step 3: Verify it's now TEXT
SHOW CREATE TABLE pets;

-- Step 4: Also check and describe the table
DESCRIBE pets;
