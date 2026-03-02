// API Service for PetGuardian Backend Integration

const API_BASE_URL = 'http://localhost:8080/api';

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  // Return empty object for DELETE requests
  if (options.method === 'DELETE') {
    return {};
  }

  return response.json();
}

// Pet API
export const petApi = {
  getAll: () => apiCall('/pets'),
  
  getById: (id: number) => apiCall(`/pets/${id}`),
  
  getByOwnerId: (ownerId: number) => apiCall(`/pets/owner/${ownerId}`),
  
  create: (pet: any) => apiCall('/pets', {
    method: 'POST',
    body: JSON.stringify(pet),
  }),
  
  update: (id: number, pet: any) => apiCall(`/pets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(pet),
  }),
  
  delete: (id: number) => apiCall(`/pets/${id}`, {
    method: 'DELETE',
  }),
};

// User API (for future implementation)
export const userApi = {
  login: (email: string, password: string) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  
  register: (userData: any) => apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
};

// Vaccination API (for future implementation)
export const vaccinationApi = {
  getByPetId: (petId: number) => apiCall(`/vaccinations/pet/${petId}`),
  
  create: (vaccination: any) => apiCall('/vaccinations', {
    method: 'POST',
    body: JSON.stringify(vaccination),
  }),
  
  update: (id: number, vaccination: any) => apiCall(`/vaccinations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(vaccination),
  }),
  
  delete: (id: number) => apiCall(`/vaccinations/${id}`, {
    method: 'DELETE',
  }),
};

// Medical Records API (for future implementation)
export const medicalRecordApi = {
  getByPetId: (petId: number) => apiCall(`/medical-records/pet/${petId}`),
  
  create: (record: any) => apiCall('/medical-records', {
    method: 'POST',
    body: JSON.stringify(record),
  }),
  
  update: (id: number, record: any) => apiCall(`/medical-records/${id}`, {
    method: 'PUT',
    body: JSON.stringify(record),
  }),
  
  delete: (id: number) => apiCall(`/medical-records/${id}`, {
    method: 'DELETE',
  }),
};

export default {
  pet: petApi,
  user: userApi,
  vaccination: vaccinationApi,
  medicalRecord: medicalRecordApi,
};
