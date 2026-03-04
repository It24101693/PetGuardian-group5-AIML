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

// Vaccination API
export const vaccinationApi = {
  create: (passportId: number, vaccination: any) => apiCall(`/health/${passportId}/vaccinations`, {
    method: 'POST',
    body: JSON.stringify(vaccination),
  }),

  update: (id: number, vaccination: any) => apiCall(`/health/vaccinations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(vaccination),
  }),

  delete: (id: number) => apiCall(`/health/vaccinations/${id}`, {
    method: 'DELETE',
  }),
};

// Medical Records API
export const medicalRecordApi = {
  create: (passportId: number, record: any) => apiCall(`/health/${passportId}/records`, {
    method: 'POST',
    body: JSON.stringify(record),
  }),

  update: (id: number, record: any) => apiCall(`/health/records/${id}`, {
    method: 'PUT',
    body: JSON.stringify(record),
  }),

  delete: (id: number) => apiCall(`/health/records/${id}`, {
    method: 'DELETE',
  }),
};

// Allergy API
export const allergyApi = {
  create: (passportId: number, allergy: any) => apiCall(`/health/${passportId}/allergies`, {
    method: 'POST',
    body: JSON.stringify(allergy),
  }),

  update: (id: number, allergy: any) => apiCall(`/health/allergies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(allergy),
  }),

  delete: (id: number) => apiCall(`/health/allergies/${id}`, {
    method: 'DELETE',
  }),
};

// Symptom Scan API
export const symptomScanApi = {
  getByPetId: (petId: number) => apiCall(`/symptom-scans/pet/${petId}`),

  create: (scan: any) => apiCall('/symptom-scans', {
    method: 'POST',
    body: JSON.stringify(scan),
  }),

  updateSeverity: (id: number, severity: string) => apiCall(`/symptom-scans/${id}/severity`, {
    method: 'PATCH',
    body: JSON.stringify(severity),
  }),

  delete: (id: number) => apiCall(`/symptom-scans/${id}`, {
    method: 'DELETE',
  }),
};

// Vet API
export const vetApi = {
  getAll: () => apiCall('/vets'),

  getById: (id: number) => apiCall(`/vets/${id}`),

  create: (vet: any) => apiCall('/vets', {
    method: 'POST',
    body: JSON.stringify(vet),
  }),

  delete: (id: number) => apiCall(`/vets/${id}`, {
    method: 'DELETE',
  }),

  getNearby: (lat: number, lon: number, radius: number = 5.0) =>
    apiCall(`/vets/nearby?lat=${lat}&lon=${lon}&radius=${radius}`),

  getEmergency: () => apiCall('/vets/emergency'),
};

// Community API
export const communityApi = {
  getAll: () => apiCall('/community'),
  create: (post: any) => apiCall('/community', {
    method: 'POST',
    body: JSON.stringify(post),
  }),
  update: (id: number, post: any) => apiCall(`/community/${id}`, {
    method: 'PUT',
    body: JSON.stringify(post),
  }),
  delete: (id: number) => apiCall(`/community/${id}`, {
    method: 'DELETE',
  }),
};

// Chat API
export const chatApi = {
  getHistory: (userId1: string, userId2: string) => apiCall(`/chat/history/${userId1}/${userId2}`),
  getAiHistory: (userId: string) => apiCall(`/chat/ai/history/${userId}`),
  sendMessage: (message: any) => apiCall('/chat/send', {
    method: 'POST',
    body: JSON.stringify(message),
  }),
  queryAi: (userId: string, query: string) => apiCall(`/chat/ai/query/${userId}`, {
    method: 'POST',
    body: query,
  }),
  getAdminKnowledge: () => apiCall('/chat/admin/knowledge'),
  addAdminKnowledge: (knowledge: any) => apiCall('/chat/admin/knowledge', {
    method: 'POST',
    body: JSON.stringify(knowledge),
  }),
};

export default {
  pet: petApi,
  user: userApi,
  vaccination: vaccinationApi,
  medicalRecord: medicalRecordApi,
  allergy: allergyApi,
  symptomScan: symptomScanApi,
  vet: vetApi,
  community: communityApi,
  chat: chatApi,
};
