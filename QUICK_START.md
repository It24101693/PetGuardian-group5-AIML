# PetGuardian - Quick Start Guide

## ✅ Database is Ready!
Your database with 23 tables has been successfully created.

## 🚀 Start the Application

### Step 1: Start Backend (Terminal 1)
```cmd
cd backend
mvnw spring-boot:run
```

**Wait for this message:**
```
Started PetGuardianApplication in X.XXX seconds
```

**Test Backend:**
Open browser: `http://localhost:8080/api/pets`
- Should see: `[]` (empty array)

---

### Step 2: Start Frontend (Terminal 2)
```cmd
cd frontend
npm run dev
```

**Open Application:**
```
http://localhost:5173
```

---

## 🎉 Test Data Persistence

### 1. Add a Pet
1. Go to: `http://localhost:5173/auth`
2. Login (any credentials work for now)
3. Click "Add New Pet"
4. Fill in the form:
   - Name: Buddy
   - Species: Dog
   - Breed: Golden Retriever
   - Date of Birth: 2020-01-15
   - Weight: 30
5. Click "Add Pet"

### 2. Verify in Database
Open MySQL Workbench and run:
```sql
USE petguardian;
SELECT * FROM pets;
```

**You should see your pet saved in the database!** 🎉

### 3. Refresh Page
- Refresh the browser
- Your pet should still be there (loaded from database)
- Before: Data disappeared on refresh
- Now: Data persists! ✅

---

## 📊 What's Connected

### ✅ Working:
- Pet CRUD operations (Create, Read, Update, Delete)
- Data saves to MySQL database
- Data loads from database on page load
- Automatic data transformation between frontend/backend

### 🔄 Still Using Mock Data:
- Vaccinations (will be connected next)
- Medical Records (will be connected next)
- User Authentication (will be connected next)

---

## 🔧 Configuration

### Backend API URL
File: `frontend/src/app/services/api.ts`
```typescript
const API_BASE_URL = 'http://localhost:8080/api';
```

### Enable/Disable Backend
File: `frontend/src/app/components/contexts/PetContext.tsx`
```typescript
const USE_BACKEND = true; // Set to false to use mock data
```

### Default User ID
File: `frontend/src/app/components/contexts/PetContext.tsx`
```typescript
const DEFAULT_OWNER_ID = 1; // Change when authentication is added
```

---

## 🐛 Troubleshooting

### Backend Not Starting
**Error:** Port 8080 already in use
```cmd
# Find process using port 8080
netstat -ano | findstr :8080

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Database Connection Error
**Error:** Access denied for user 'root'

**Fix:** Update `backend/src/main/resources/application.properties`
```properties
spring.datasource.password=YOUR_ACTUAL_PASSWORD
```

### Frontend Can't Connect to Backend
**Error:** Failed to fetch

**Check:**
1. Backend is running: `http://localhost:8080/api/pets`
2. CORS is enabled in `WebConfig.java`
3. No firewall blocking port 8080

### Data Not Saving
**Check:**
1. Backend console for errors
2. Browser console (F12) for errors
3. `USE_BACKEND = true` in PetContext.tsx
4. Database tables exist: `SHOW TABLES;`

---

## 📝 API Endpoints

### Pets
- `GET /api/pets` - Get all pets
- `GET /api/pets/{id}` - Get pet by ID
- `GET /api/pets/owner/{ownerId}` - Get pets by owner
- `POST /api/pets` - Create new pet
- `PUT /api/pets/{id}` - Update pet
- `DELETE /api/pets/{id}` - Delete pet

### Example: Create Pet (POST /api/pets)
```json
{
  "ownerId": 1,
  "name": "Buddy",
  "species": "Dog",
  "breed": "Golden Retriever",
  "dateOfBirth": "2020-01-15",
  "age": 4,
  "weight": 30.5,
  "microchipNumber": "CH123456",
  "imageUrl": "/placeholder-dog.svg",
  "status": "HEALTHY",
  "gender": "MALE"
}
```

---

## 🎯 Next Steps

1. ✅ Database created (23 tables)
2. ✅ Backend API created
3. ✅ Frontend connected to backend
4. ✅ Pet data persists to database
5. 🔄 Add authentication
6. 🔄 Connect vaccinations to backend
7. 🔄 Connect medical records to backend
8. 🔄 Add veterinarian features

---

## 📚 Documentation

- **Database Schema:** `database/DATABASE_DOCUMENTATION.md`
- **Installation Guide:** `database/INSTALLATION_GUIDE.md`
- **Backend Integration:** `BACKEND_INTEGRATION_GUIDE.md`
- **Animations Guide:** `ANIMATIONS_GUIDE.md`

---

## ✨ Success Indicators

### Backend Running Successfully:
```
✓ HikariPool-1 - Start completed
✓ Started PetGuardianApplication in X.XXX seconds
✓ Tomcat started on port(s): 8080
```

### Frontend Running Successfully:
```
✓ VITE v5.x.x ready in XXX ms
✓ Local: http://localhost:5173/
```

### Data Persisting Successfully:
1. Add a pet in the UI
2. Check database: `SELECT * FROM pets;`
3. See your pet data ✅
4. Refresh browser
5. Pet still appears ✅

---

**Your PetGuardian system is now fully connected to the database!** 🎉

All pet data will be saved and persisted across sessions.
