export interface Pet {
    id: string;
    name: string;
    species: string;
    breed: string;
    dateOfBirth: string;
    age: number;
    weight: number;
    chipNumber?: string;
    imageUrl: string;
    status: 'healthy' | 'vaccine-due' | 'attention';
    ownerId: string;
}

export interface Vaccination {
    id: string;
    petId: string;
    vaccineName: string;
    dateGiven: string;
    nextDueDate: string;
    veterinarian: string;
}

export interface MedicalRecord {
    id: string;
    petId: string;
    date: string;
    type: 'checkup' | 'surgery' | 'illness' | 'injury';
    title: string;
    description: string;
    veterinarian: string;
    medications?: string[];
}

export interface Appointment {
    id: string;
    petId: string;
    petName: string;
    ownerName: string;
    date: string;
    time: string;
    reason: string;
    status: 'scheduled' | 'completed' | 'cancelled';
}

// Mock data
export const mockPets: Pet[] = [
    {
        id: '1',
        name: 'Bella',
        species: 'Dog',
        breed: 'Golden Retriever',
        dateOfBirth: '2020-05-15',
        age: 4,
        weight: 30,
        chipNumber: 'CH123456789',
        imageUrl: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400',
        status: 'vaccine-due',
        ownerId: '1'
    },
    {
        id: '2',
        name: 'Luna',
        species: 'Cat',
        breed: 'Persian',
        dateOfBirth: '2021-08-22',
        age: 3,
        weight: 4.5,
        chipNumber: 'CH987654321',
        imageUrl: 'https://images.unsplash.com/photo-1573865526739-10c1dd7e1eb8?w=400',
        status: 'healthy',
        ownerId: '1'
    },
    {
        id: '3',
        name: 'Max',
        species: 'Dog',
        breed: 'German Shepherd',
        dateOfBirth: '2019-03-10',
        age: 5,
        weight: 35,
        chipNumber: 'CH456789123',
        imageUrl: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400',
        status: 'healthy',
        ownerId: '1'
    }
];

export const mockVaccinations: Vaccination[] = [
    {
        id: 'v1',
        petId: '1',
        vaccineName: 'Rabies',
        dateGiven: '2024-02-15',
        nextDueDate: '2025-02-15',
        veterinarian: 'Dr. Emily Martinez'
    },
    {
        id: 'v2',
        petId: '1',
        vaccineName: 'DHPP (Distemper)',
        dateGiven: '2024-01-10',
        nextDueDate: '2027-01-10',
        veterinarian: 'Dr. Emily Martinez'
    },
    {
        id: 'v3',
        petId: '2',
        vaccineName: 'FVRCP',
        dateGiven: '2024-03-20',
        nextDueDate: '2027-03-20',
        veterinarian: 'Dr. Robert Chen'
    }
];

export const mockMedicalRecords: MedicalRecord[] = [
    {
        id: 'm1',
        petId: '1',
        date: '2024-02-15',
        type: 'checkup',
        title: 'Annual Health Checkup',
        description: 'Routine examination. Pet is in good health. Weight is normal. Teeth are clean.',
        veterinarian: 'Dr. Emily Martinez',
        medications: []
    },
    {
        id: 'm2',
        petId: '1',
        date: '2023-11-05',
        type: 'illness',
        title: 'Ear Infection',
        description: 'Treated for bacterial ear infection. Prescribed antibiotics for 10 days.',
        veterinarian: 'Dr. Emily Martinez',
        medications: ['Amoxicillin 250mg']
    },
    {
        id: 'm3',
        petId: '2',
        date: '2024-03-20',
        type: 'checkup',
        title: 'Vaccination and Health Check',
        description: 'FVRCP vaccination administered. Overall health is excellent.',
        veterinarian: 'Dr. Robert Chen',
        medications: []
    }
];

export const mockAppointments: Appointment[] = [
    {
        id: 'a1',
        petId: '1',
        petName: 'Bella',
        ownerName: 'Sarah Johnson',
        date: '2026-02-27',
        time: '10:00 AM',
        reason: 'Rabies Vaccination',
        status: 'scheduled'
    },
    {
        id: 'a2',
        petId: '4',
        petName: 'Charlie',
        ownerName: 'Michael Brown',
        date: '2026-02-24',
        time: '2:00 PM',
        reason: 'Annual Checkup',
        status: 'scheduled'
    },
    {
        id: 'a3',
        petId: '5',
        petName: 'Daisy',
        ownerName: 'Jennifer Lee',
        date: '2026-02-24',
        time: '3:30 PM',
        reason: 'Skin Rash Examination',
        status: 'scheduled'
    }
];
