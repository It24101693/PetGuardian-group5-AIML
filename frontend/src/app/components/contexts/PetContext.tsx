import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockPets, mockVaccinations, mockMedicalRecords, Pet, Vaccination, MedicalRecord } from '../data/mockData';
import { petApi } from '../../services/api';

interface PetContextType {
    pets: Pet[];
    vaccinations: Vaccination[];
    medicalRecords: MedicalRecord[];
    loading: boolean;
    error: string | null;

    // Pet CRUD
    addPet: (pet: Omit<Pet, 'id'>) => Promise<void>;
    updatePet: (id: string, pet: Partial<Pet>) => Promise<void>;
    deletePet: (id: string) => Promise<void>;

    // Vaccination CRUD
    addVaccination: (vaccination: Omit<Vaccination, 'id'>) => void;
    updateVaccination: (id: string, vaccination: Partial<Vaccination>) => void;
    deleteVaccination: (id: string) => void;

    // Medical Record CRUD
    addMedicalRecord: (record: Omit<MedicalRecord, 'id'>) => void;
    updateMedicalRecord: (id: string, record: Partial<MedicalRecord>) => void;
    deleteMedicalRecord: (id: string) => void;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

// Configuration
const USE_BACKEND = true; // Set to false to use mock data
const DEFAULT_OWNER_ID = 1; // TODO: Replace with actual logged-in user ID

export function PetProvider({ children }: { children: ReactNode }) {
    const [pets, setPets] = useState<Pet[]>([]);
    const [vaccinations, setVaccinations] = useState<Vaccination[]>(mockVaccinations);
    const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(mockMedicalRecords);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load pets from backend on mount
    useEffect(() => {
        if (USE_BACKEND) {
            loadPetsFromBackend();
        } else {
            setPets(mockPets);
        }
    }, []);

    const loadPetsFromBackend = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await petApi.getByOwnerId(DEFAULT_OWNER_ID);
            
            // Transform backend data to match frontend format
            const transformedPets = data.map((pet: any) => ({
                id: pet.id.toString(),
                name: pet.name,
                species: pet.species,
                breed: pet.breed,
                dateOfBirth: pet.dateOfBirth,
                age: pet.age,
                weight: pet.weight,
                chipNumber: pet.microchipNumber,
                imageUrl: pet.imageUrl || '/placeholder-dog.svg',
                status: pet.status.toLowerCase().replace('_', '-') as Pet['status'],
                ownerId: pet.ownerId.toString()
            }));
            
            setPets(transformedPets);
        } catch (err) {
            console.error('Error loading pets from backend:', err);
            setError('Failed to load pets. Using mock data.');
            setPets(mockPets); // Fallback to mock data
        } finally {
            setLoading(false);
        }
    };

    // Pet CRUD
    const addPet = async (pet: Omit<Pet, 'id'>) => {
        if (USE_BACKEND) {
            try {
                setLoading(true);
                setError(null);
                
                // Transform frontend data to backend format
                const backendPet = {
                    ownerId: DEFAULT_OWNER_ID,
                    name: pet.name,
                    species: pet.species,
                    breed: pet.breed,
                    dateOfBirth: pet.dateOfBirth,
                    age: pet.age,
                    weight: pet.weight,
                    microchipNumber: pet.chipNumber,
                    imageUrl: pet.imageUrl,
                    status: pet.status.toUpperCase().replace('-', '_'),
                    gender: 'UNKNOWN'
                };
                
                const createdPet = await petApi.create(backendPet);
                
                // Transform back to frontend format
                const newPet: Pet = {
                    id: createdPet.id.toString(),
                    name: createdPet.name,
                    species: createdPet.species,
                    breed: createdPet.breed,
                    dateOfBirth: createdPet.dateOfBirth,
                    age: createdPet.age,
                    weight: createdPet.weight,
                    chipNumber: createdPet.microchipNumber,
                    imageUrl: createdPet.imageUrl || '/placeholder-dog.svg',
                    status: createdPet.status.toLowerCase().replace('_', '-') as Pet['status'],
                    ownerId: createdPet.ownerId.toString()
                };
                
                setPets(prev => [...prev, newPet]);
            } catch (err) {
                console.error('Error adding pet:', err);
                setError('Failed to add pet');
                throw err;
            } finally {
                setLoading(false);
            }
        } else {
            // Mock data fallback
            const newPet = {
                ...pet,
                id: `pet-${Date.now()}-${Math.random().toString(36).substring(7)}`
            };
            setPets(prev => [...prev, newPet]);
        }
    };

    const updatePet = async (id: string, petUpdate: Partial<Pet>) => {
        if (USE_BACKEND) {
            try {
                setLoading(true);
                setError(null);
                
                // Transform to backend format
                const backendUpdate: any = {};
                if (petUpdate.name) backendUpdate.name = petUpdate.name;
                if (petUpdate.species) backendUpdate.species = petUpdate.species;
                if (petUpdate.breed) backendUpdate.breed = petUpdate.breed;
                if (petUpdate.dateOfBirth) backendUpdate.dateOfBirth = petUpdate.dateOfBirth;
                if (petUpdate.age) backendUpdate.age = petUpdate.age;
                if (petUpdate.weight) backendUpdate.weight = petUpdate.weight;
                if (petUpdate.chipNumber) backendUpdate.microchipNumber = petUpdate.chipNumber;
                if (petUpdate.imageUrl) backendUpdate.imageUrl = petUpdate.imageUrl;
                if (petUpdate.status) backendUpdate.status = petUpdate.status.toUpperCase().replace('-', '_');
                
                const updatedPet = await petApi.update(Number(id), backendUpdate);
                
                // Transform back to frontend format
                const transformedPet: Pet = {
                    id: updatedPet.id.toString(),
                    name: updatedPet.name,
                    species: updatedPet.species,
                    breed: updatedPet.breed,
                    dateOfBirth: updatedPet.dateOfBirth,
                    age: updatedPet.age,
                    weight: updatedPet.weight,
                    chipNumber: updatedPet.microchipNumber,
                    imageUrl: updatedPet.imageUrl || '/placeholder-dog.svg',
                    status: updatedPet.status.toLowerCase().replace('_', '-') as Pet['status'],
                    ownerId: updatedPet.ownerId.toString()
                };
                
                setPets(prev => prev.map(p => p.id === id ? transformedPet : p));
            } catch (err) {
                console.error('Error updating pet:', err);
                setError('Failed to update pet');
                throw err;
            } finally {
                setLoading(false);
            }
        } else {
            // Mock data fallback
            setPets(prev => prev.map(p => p.id === id ? { ...p, ...petUpdate } : p));
        }
    };

    const deletePet = async (id: string) => {
        if (USE_BACKEND) {
            try {
                setLoading(true);
                setError(null);
                
                await petApi.delete(Number(id));
                
                setPets(prev => prev.filter(p => p.id !== id));
                // Also delete associated records
                setVaccinations(prev => prev.filter(v => v.petId !== id));
                setMedicalRecords(prev => prev.filter(m => m.petId !== id));
            } catch (err) {
                console.error('Error deleting pet:', err);
                setError('Failed to delete pet');
                throw err;
            } finally {
                setLoading(false);
            }
        } else {
            // Mock data fallback
            setPets(prev => prev.filter(p => p.id !== id));
            setVaccinations(prev => prev.filter(v => v.petId !== id));
            setMedicalRecords(prev => prev.filter(m => m.petId !== id));
        }
    };

    // Vaccination CRUD
    const addVaccination = (vaccination: Omit<Vaccination, 'id'>) => {
        const newVaccination = {
            ...vaccination,
            id: `vac-${Date.now()}-${Math.random().toString(36).substring(7)}`
        };
        setVaccinations(prev => [...prev, newVaccination]);
    };

    const updateVaccination = (id: string, vaccinationUpdate: Partial<Vaccination>) => {
        setVaccinations(prev => prev.map(v => v.id === id ? { ...v, ...vaccinationUpdate } : v));
    };

    const deleteVaccination = (id: string) => {
        setVaccinations(prev => prev.filter(v => v.id !== id));
    };

    // Medical Record CRUD
    const addMedicalRecord = (record: Omit<MedicalRecord, 'id'>) => {
        const newRecord = {
            ...record,
            id: `med-${Date.now()}-${Math.random().toString(36).substring(7)}`
        };
        setMedicalRecords(prev => [...prev, newRecord]);
    };

    const updateMedicalRecord = (id: string, recordUpdate: Partial<MedicalRecord>) => {
        setMedicalRecords(prev => prev.map(r => r.id === id ? { ...r, ...recordUpdate } : r));
    };

    const deleteMedicalRecord = (id: string) => {
        setMedicalRecords(prev => prev.filter(r => r.id !== id));
    };

    return (
        <PetContext.Provider value={{
            pets,
            vaccinations,
            medicalRecords,
            loading,
            error,
            addPet,
            updatePet,
            deletePet,
            addVaccination,
            updateVaccination,
            deleteVaccination,
            addMedicalRecord,
            updateMedicalRecord,
            deleteMedicalRecord
        }}>
            {children}
        </PetContext.Provider>
    );
}

export function usePets() {
    const context = useContext(PetContext);
    if (context === undefined) {
        throw new Error('usePets must be used within a PetProvider');
    }
    return context;
}
