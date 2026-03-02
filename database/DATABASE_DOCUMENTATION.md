# PetGuardian Database Documentation

## Overview
Complete database schema for the PetGuardian pet health management system.

## Database Structure

### 1. Users & Authentication (3 tables)
- **users** - Main user accounts (owners, vets, admins)
- **user_profiles** - Extended user information (address, emergency contacts)
- **veterinarians** - Veterinarian-specific details (license, clinic, ratings)
- **vet_working_hours** - Veterinarian availability schedule

### 2. Pets & Health (3 tables)
- **pets** - Pet information and profiles
- **pet_allergies** - Pet allergy records
- **vaccinations** - Vaccination history and schedules

### 3. Medical Records (3 tables)
- **medical_records** - Veterinary visit records
- **medications** - Prescribed medications
- **medical_documents** - Attached files (lab reports, x-rays, etc.)

### 4. Appointments (1 table)
- **appointments** - Scheduled veterinary appointments

### 5. Reviews & Ratings (1 table)
- **vet_reviews** - Veterinarian reviews and ratings

### 6. Community Features (3 tables)
- **community_posts** - User posts in community
- **post_comments** - Comments on posts
- **post_likes** - Post likes/reactions

### 7. AI Features (3 tables)
- **ai_chat_sessions** - AI chatbot conversation sessions
- **ai_chat_messages** - Individual chat messages
- **ai_health_assessments** - AI health risk assessments

### 8. Notifications (1 table)
- **notifications** - User notifications (reminders, alerts)

### 9. System & Tracking (2 tables)
- **audit_logs** - System audit trail
- **qr_code_scans** - QR code scan tracking

## Total Tables: 23

## Key Features

### Relationships
- Users → Pets (One-to-Many)
- Pets → Vaccinations (One-to-Many)
- Pets → Medical Records (One-to-Many)
- Veterinarians → Appointments (One-to-Many)
- Users → Community Posts (One-to-Many)
- Posts → Comments (One-to-Many)

### Indexes
- Primary keys on all tables
- Foreign key indexes for relationships
- Performance indexes on frequently queried columns
- Composite indexes for common query patterns

### Data Integrity
- Foreign key constraints with CASCADE/SET NULL
- ENUM types for status fields
- CHECK constraints for ratings
- UNIQUE constraints for emails, usernames, microchips

### Security Features
- Password hashing (bcrypt recommended)
- Audit logging for all actions
- Soft deletes with is_active flags
- IP address tracking

## Installation

### Option 1: Direct SQL
```bash
mysql -u root -p < database/schemas/petguardian_complete_schema.sql
```

### Option 2: Flyway Migration
```bash
# Place migration files in db/migration/
# Run Flyway migrate
flyway migrate
```

### Option 3: Spring Boot Auto-Migration
Configure in application.properties:
```properties
spring.jpa.hibernate.ddl-auto=update
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
```

## Sample Queries

### Get Pet Health Summary
```sql
SELECT * FROM v_pet_health_summary WHERE pet_id = 1;
```

### Get Upcoming Appointments
```sql
SELECT * FROM v_upcoming_appointments 
WHERE appointment_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY);
```

### Get Overdue Vaccinations
```sql
SELECT p.name, v.vaccine_name, v.next_due_date
FROM vaccinations v
JOIN pets p ON v.pet_id = p.id
WHERE v.next_due_date < CURDATE()
ORDER BY v.next_due_date;
```

### Get Vet Ratings
```sql
SELECT 
    v.clinic_name,
    v.rating,
    v.total_reviews,
    u.full_name AS vet_name
FROM veterinarians v
JOIN users u ON v.user_id = u.id
WHERE v.is_verified = TRUE
ORDER BY v.rating DESC;
```

## Maintenance

### Backup
```bash
mysqldump -u root -p petguardian > backup_$(date +%Y%m%d).sql
```

### Restore
```bash
mysql -u root -p petguardian < backup_20260228.sql
```

### Optimize Tables
```sql
OPTIMIZE TABLE pets, vaccinations, medical_records, appointments;
```

## Performance Considerations

1. **Indexes**: All foreign keys and frequently queried columns are indexed
2. **Partitioning**: Consider partitioning large tables (audit_logs, notifications) by date
3. **Archiving**: Archive old records (>2 years) to separate tables
4. **Caching**: Use Redis for frequently accessed data (user sessions, pet summaries)

## Security Best Practices

1. Use prepared statements to prevent SQL injection
2. Hash passwords with bcrypt (cost factor 10+)
3. Encrypt sensitive data (medical records, personal info)
4. Regular security audits via audit_logs table
5. Implement row-level security for multi-tenant data
6. Use SSL/TLS for database connections

## Migration Path

### From V1 to V2
The V2 migration adds:
- Extended user profiles
- Veterinarian management
- Community features
- AI chat history
- Notifications system
- Audit logging
- QR code tracking

All existing data is preserved. New columns have default values.

## Future Enhancements

Potential additions:
- Payment transactions table
- Subscription management
- Pet insurance integration
- Telemedicine sessions
- Pet activity tracking
- Nutrition plans
- Grooming schedules

## Support

For database issues:
1. Check migration logs
2. Verify foreign key constraints
3. Review audit_logs for data changes
4. Contact database administrator

---

**Database Version**: 2.0  
**Last Updated**: 2026-02-28  
**Total Tables**: 23  
**Total Views**: 2
