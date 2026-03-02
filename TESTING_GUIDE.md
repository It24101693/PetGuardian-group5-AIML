# Testing Guide - Backend Integration

## Current Status
✅ Backend running on: http://localhost:8080
✅ Frontend running on: http://localhost:5174
✅ CORS configuration fixed
✅ Database connected

## Fixed Issues
1. **CORS Error**: Changed from `allowedOrigins()` to `allowedOriginPatterns()` with wildcard support
2. **Port Conflict**: Updated CORS to allow any localhost port (`http://localhost:*`)
3. **Conflicting Annotations**: Removed `@CrossOrigin` from PetController

## How to Test Pet Creation

### Step 1: Open the Application
Navigate to: http://localhost:5174

### Step 2: Add a New Pet
1. Click on "Add New Pet" button on the Owner Dashboard
2. Fill in the pet details:
   - Name: e.g., "Buddy"
   - Species: e.g., "Dog"
   - Breed: e.g., "Golden Retriever"
   - Date of Birth: Select a date
   - Weight: e.g., "25"
   - Chip Number: e.g., "123456789"
   - Image URL: Leave default or add custom URL
3. Click "Add Pet"

### Step 3: Verify Data Persistence
The pet should now:
- ✅ Appear in the dashboard immediately
- ✅ Be stored in the MySQL database
- ✅ Persist after page refresh

### Step 4: Check Database (Optional)
Open MySQL Workbench and run:
```sql
SELECT * FROM pets;
```

You should see your newly created pet in the database.

## API Endpoints Available

### Pets
- `GET /api/pets` - Get all pets
- `GET /api/pets/{id}` - Get pet by ID
- `GET /api/pets/owner/{ownerId}` - Get pets by owner ID
- `POST /api/pets` - Create new pet
- `PUT /api/pets/{id}` - Update pet
- `DELETE /api/pets/{id}` - Delete pet

### Test with cURL
```bash
# Get all pets for owner 1
curl http://localhost:8080/api/pets/owner/1

# Create a new pet
curl -X POST http://localhost:8080/api/pets \
  -H "Content-Type: application/json" \
  -d '{
    "ownerId": 1,
    "name": "Max",
    "species": "Dog",
    "breed": "Labrador",
    "dateOfBirth": "2020-01-15",
    "age": 4,
    "weight": 30.5,
    "microchipNumber": "987654321",
    "gender": "MALE",
    "status": "ACTIVE"
  }'
```

## Troubleshooting

### If pets don't appear after adding:
1. Check browser console for errors (F12)
2. Verify backend is running: http://localhost:8080/api/pets/owner/1
3. Check database connection in application.properties

### If CORS errors appear:
1. Verify frontend port matches CORS configuration
2. Check WebConfig.java has `allowedOriginPatterns` with wildcards
3. Restart backend after any CORS changes

### If backend won't start:
1. Check if port 8080 is already in use: `netstat -ano | findstr :8080`
2. Kill the process: `taskkill /F /PID <process_id>`
3. Restart: `java -jar target/backend-0.0.1-SNAPSHOT.jar`

## Next Steps
Once pet creation is working:
1. Test pet update functionality
2. Test pet deletion
3. Implement vaccination tracking with backend
4. Implement medical records with backend
5. Add user authentication
