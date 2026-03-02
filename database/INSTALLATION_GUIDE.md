# PetGuardian Database Installation Guide

## Option 1: Direct MySQL Installation (Windows)

### Prerequisites
1. MySQL Server installed on your system
2. MySQL command-line client (comes with MySQL Server)
3. Database administrator credentials (root user)

### Step-by-Step Installation

#### Step 1: Open Command Prompt
1. Press `Win + R`
2. Type `cmd` and press Enter
3. Navigate to your project directory:
   ```cmd
   cd C:\path\to\your\petguardian\project
   ```

#### Step 2: Login to MySQL
```cmd
mysql -u root -p
```
- Enter your MySQL root password when prompted
- You should see: `mysql>`

#### Step 3: Create Database (if not exists)
```sql
CREATE DATABASE IF NOT EXISTS petguardian;
USE petguardian;
```

#### Step 4: Exit MySQL and Run Schema File
```cmd
exit
```

Then run:
```cmd
mysql -u root -p petguardian < database\schemas\petguardian_complete_schema.sql
```
- Enter your password when prompted
- Wait for completion (should take 5-10 seconds)

#### Step 5: Verify Installation
Login to MySQL again:
```cmd
mysql -u root -p petguardian
```

Check tables:
```sql
SHOW TABLES;
```

You should see 23 tables listed:
```
+---------------------------+
| Tables_in_petguardian     |
+---------------------------+
| ai_chat_messages          |
| ai_chat_sessions          |
| ai_health_assessments     |
| appointments              |
| audit_logs                |
| community_posts           |
| medical_documents         |
| medical_records           |
| medications               |
| notifications             |
| pet_allergies             |
| pets                      |
| post_comments             |
| post_likes                |
| qr_code_scans             |
| user_profiles             |
| users                     |
| vaccinations              |
| vet_reviews               |
| vet_working_hours         |
| veterinarians             |
+---------------------------+
```

Check a specific table structure:
```sql
DESCRIBE users;
```

Exit MySQL:
```sql
exit
```

---

## Alternative: Using MySQL Workbench (GUI Method)

### Step 1: Open MySQL Workbench
1. Launch MySQL Workbench
2. Connect to your local MySQL server

### Step 2: Open SQL Script
1. Click `File` → `Open SQL Script`
2. Navigate to: `database/schemas/petguardian_complete_schema.sql`
3. Click `Open`

### Step 3: Execute Script
1. Click the lightning bolt icon (⚡) or press `Ctrl + Shift + Enter`
2. Wait for execution to complete
3. Check the output panel for success messages

### Step 4: Verify
1. In the left sidebar, click `Schemas`
2. Right-click and select `Refresh All`
3. Expand `petguardian` database
4. You should see all 23 tables

---

## Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"
**Solution**: Check your MySQL password
```cmd
mysql -u root -p
# Enter correct password
```

### Error: "mysql is not recognized as an internal or external command"
**Solution**: Add MySQL to PATH
1. Find MySQL bin directory (usually: `C:\Program Files\MySQL\MySQL Server 8.0\bin`)
2. Add to System PATH:
   - Right-click `This PC` → `Properties`
   - Click `Advanced system settings`
   - Click `Environment Variables`
   - Under `System variables`, find `Path`
   - Click `Edit` → `New`
   - Add MySQL bin path
   - Click `OK` and restart Command Prompt

### Error: "Database already exists"
**Solution**: Drop and recreate
```sql
DROP DATABASE IF EXISTS petguardian;
CREATE DATABASE petguardian;
USE petguardian;
```
Then run the schema file again.

### Error: "Table already exists"
**Solution**: The schema uses `CREATE TABLE IF NOT EXISTS`, so this shouldn't happen. If it does:
```sql
DROP DATABASE petguardian;
CREATE DATABASE petguardian;
```
Then run the schema file again.

---

## Update Application Configuration

After installing the database, update your Spring Boot configuration:

### File: `backend/src/main/resources/application.properties`

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/petguardian?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

# Flyway Configuration (Optional)
spring.flyway.enabled=false
```

**Important**: Replace `YOUR_MYSQL_PASSWORD` with your actual MySQL root password.

---

## Verify Database Connection from Spring Boot

### Step 1: Start Spring Boot Application
```cmd
cd backend
mvnw spring-boot:run
```

### Step 2: Check Console Output
Look for:
```
✓ HikariPool-1 - Start completed.
✓ Started PetGuardianApplication in X.XXX seconds
```

### Step 3: Test Connection
Open browser and go to:
```
http://localhost:8080/actuator/health
```

Should return:
```json
{
  "status": "UP"
}
```

---

## Sample Data (Optional)

To add sample data for testing:

```sql
USE petguardian;

-- Add a test user
INSERT INTO users (username, email, password_hash, full_name, role, email_verified) 
VALUES ('testuser', 'test@example.com', '$2a$10$dummyhash', 'Test User', 'OWNER', TRUE);

-- Add a test pet
INSERT INTO pets (owner_id, name, species, breed, date_of_birth, age, weight, status) 
VALUES (1, 'Buddy', 'Dog', 'Golden Retriever', '2020-01-15', 4, 30.5, 'HEALTHY');

-- Add a test vaccination
INSERT INTO vaccinations (pet_id, vaccine_name, administered_date, next_due_date) 
VALUES (1, 'Rabies', '2024-01-15', '2025-01-15');
```

---

## Backup & Restore

### Create Backup
```cmd
mysqldump -u root -p petguardian > petguardian_backup.sql
```

### Restore from Backup
```cmd
mysql -u root -p petguardian < petguardian_backup.sql
```

---

## Next Steps

1. ✅ Database installed
2. ✅ Tables created
3. ✅ Configuration updated
4. 🔄 Start Spring Boot backend
5. 🔄 Test API endpoints
6. 🔄 Start React frontend
7. 🔄 Test full application

---

## Need Help?

- Check MySQL error log: `C:\ProgramData\MySQL\MySQL Server 8.0\Data\*.err`
- Verify MySQL service is running: `services.msc` → Find "MySQL80"
- Test connection: `mysql -u root -p -e "SELECT 1"`

---

**Installation Complete!** 🎉

Your PetGuardian database is now ready to use.
