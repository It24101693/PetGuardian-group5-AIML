# Backend Integration Guide - PetGuardian

## Problem
Currently, the frontend uses mock data stored in browser memory. When you add pets or other data, it's not saved to the database.

## Solution
Connect the frontend to the Spring Boot backend API.

---

## Step 1: Start the Backend Server

### Option A: Using Maven (Command Line)
```cmd
cd backend
mvnw spring-boot:run
```

### Option B: Using IntelliJ IDEA
1. Open the project in IntelliJ
2. Find `PetGuardianApplication.java`
3. Click the green play button ▶️
4. Wait for "Started PetGuardianApplication" message

### Verify Backend is Running
Open browser and go to:
```
http://localhost:8080/api/pets
```

You should see: `[]` (empty array) or list of pets

---

## Step 2: Update Frontend API Configuration

### Create API Service File

Create: `frontend/src/app/services/api.ts`

```typescript
const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
  // Pets
  getPets: async (ownerId: number) => {
    const response = await fetch(`${API_BASE_URL}/pets/owner/${ownerId}`);
    return response.json();
  },
  
  createPet: async (pet: any) => {
    const response = await fetch(`${API_BASE_URL}/pets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pet)
    });
    return response.json();
  },
  
  updatePet: async (id: number, pet: any) => {
    const response = await fetch(`${API_BASE_URL}/pets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pet)
    });
    return response.json();
  },
  
  deletePet: async (id: number) => {
    await fetch(`${API_BASE_URL}/pets/${id}`, {
      method: 'DELETE'
    });
  }
};
```

---

## Step 3: Update PetContext to Use Real API

### Modify: `frontend/src/app/components/contexts/PetContext.tsx`

Replace the mock data functions with API calls:

```typescript
import { api } from '../../services/api';

// In addPet function:
const addPet = async (petData: Omit<Pet, 'id'>) => {
  try {
    const newPet = await api.createPet({
      ...petData,
      ownerId: 1 // Replace with actual logged-in user ID
    });
    setPets(prev => [...prev, newPet]);
  } catch (error) {
    console.error('Error adding pet:', error);
  }
};

// In updatePet function:
const updatePet = async (id: string, updates: Partial<Pet>) => {
  try {
    const updated = await api.updatePet(Number(id), updates);
    setPets(prev => prev.map(p => p.id === id ? updated : p));
  } catch (error) {
    console.error('Error updating pet:', error);
  }
};

// In deletePet function:
const deletePet = async (id: string) => {
  try {
    await api.deletePet(Number(id));
    setPets(prev => prev.filter(p => p.id !== id));
  } catch (error) {
    console.error('Error deleting pet:', error);
  }
};

// Load pets on mount:
useEffect(() => {
  const loadPets = async () => {
    try {
      const data = await api.getPets(1); // Replace with actual user ID
      setPets(data);
    } catch (error) {
      console.error('Error loading pets:', error);
    }
  };
  loadPets();
}, []);
```

---

## Step 4: Test the Integration

### 1. Start Backend
```cmd
cd backend
mvnw spring-boot:run
```

Wait for: `Started PetGuardianApplication`

### 2. Start Frontend
```cmd
cd frontend
npm run dev
```

### 3. Test Adding a Pet
1. Go to: `http://localhost:5173/owner/dashboard`
2. Click "Add New Pet"
3. Fill in the form
4. Click "Add Pet"

### 4. Verify in Database
Open MySQL Workbench and run:
```sql
USE petguardian;
SELECT * FROM pets;
```

You should see your newly added pet! 🎉

---

## Current API Endpoints

### Pets
- `GET /api/pets` - Get all pets
- `GET /api/pets/{id}` - Get pet by ID
- `GET /api/pets/owner/{ownerId}` - Get pets by owner
- `POST /api/pets` - Create new pet
- `PUT /api/pets/{id}` - Update pet
- `DELETE /api/pets/{id}` - Delete pet (soft delete)

### Example Request Body (Create Pet)
```json
{
  "ownerId": 1,
  "name": "Buddy",
  "species": "Dog",
  "breed": "Golden Retriever",
  "dateOfBirth": "2020-01-15",
  "age": 4,
  "weight": 30.5,
  "gender": "MALE",
  "imageUrl": "/placeholder-dog.svg",
  "status": "HEALTHY"
}
```

---

## Troubleshooting

### Error: "Failed to fetch"
**Cause**: Backend not running or CORS issue

**Solution**:
1. Check backend is running: `http://localhost:8080/api/pets`
2. Verify CORS is enabled in `WebConfig.java`

### Error: "404 Not Found"
**Cause**: Wrong API endpoint

**Solution**: Check the URL matches the controller mapping

### Error: "500 Internal Server Error"
**Cause**: Database connection issue or validation error

**Solution**:
1. Check `application.properties` has correct database credentials
2. Check backend console for error details
3. Verify database tables exist: `SHOW TABLES;`

### Data Not Persisting
**Cause**: Still using mock data

**Solution**: Ensure you've updated PetContext to use API calls

---

## Next Steps

1. ✅ Backend API created
2. ✅ Database tables created
3. 🔄 Create API service file
4. 🔄 Update PetContext to use API
5. 🔄 Test integration
6. 🔄 Add authentication
7. 🔄 Add more endpoints (vaccinations, medical records, etc.)

---

## Quick Start Commands

```cmd
# Terminal 1 - Backend
cd backend
mvnw spring-boot:run

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

Then open: `http://localhost:5173`

---

**Your data will now be saved to the MySQL database!** 🎉
