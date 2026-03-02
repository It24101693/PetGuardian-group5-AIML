-- Step 1: Check current column definition
USE petguardian;

SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    CHARACTER_MAXIMUM_LENGTH,
    COLUMN_TYPE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'petguardian' 
  AND TABLE_NAME = 'pets' 
  AND COLUMN_NAME = 'image_url';

-- Step 2: Fix the column (run this if the above shows VARCHAR(500))
ALTER TABLE pets MODIFY COLUMN image_url TEXT;

-- Step 3: Verify the fix
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    CHARACTER_MAXIMUM_LENGTH,
    COLUMN_TYPE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'petguardian' 
  AND TABLE_NAME = 'pets' 
  AND COLUMN_NAME = 'image_url';

-- You should now see DATA_TYPE = 'text' and CHARACTER_MAXIMUM_LENGTH = 65535
