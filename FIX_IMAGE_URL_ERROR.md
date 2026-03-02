# Fix: Data too long for column 'image_url'

## Problem
The database column `image_url` is VARCHAR(500) which is too small for long image URLs.

## Solution
Run this SQL command in MySQL Workbench:

### Step 1: Open MySQL Workbench
1. Connect to your database
2. Open a new SQL tab

### Step 2: Run this SQL
```sql
USE petguardian;

-- Increase image_url column size in pets table
ALTER TABLE pets MODIFY COLUMN image_url TEXT;

-- Also update profile_image_url in users table for consistency
ALTER TABLE users MODIFY COLUMN profile_image_url TEXT;
```

### Step 3: Verify the change
```sql
DESCRIBE pets;
```

You should see `image_url` is now `TEXT` instead of `VARCHAR(500)`.

### Step 4: Restart backend
After running the SQL, the backend should work without restarting, but if issues persist:
1. Stop the backend (if running)
2. Start it again

## Alternative: Run from command line
If you have MySQL in your PATH:
```bash
mysql -u root -p petguardian < database/migrations/V3__increase_image_url_length.sql
```

Then enter your password: `Gaddps@6565`
