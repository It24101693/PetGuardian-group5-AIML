import * as React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockPets, mockVaccinations, mockMedicalRecords, Pet, Vaccination, MedicalRecord } from '../data/mockData';
import { petApi, vaccinationApi, medicalRecordApi } from '../../services/api';

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
    addVaccination: (petId: string, vaccination: Omit<Vaccination, 'id' | 'petId'>) => Promise<void>;
    updateVaccination: (id: string, vaccination: Partial<Vaccination>) => Promise<void>;
    deleteVaccination: (id: string) => Promise<void>;

    // Medical Record CRUD
    addMedicalRecord: (petId: string, record: Omit<MedicalRecord, 'id' | 'petId'>) => Promise<void>;
    updateMedicalRecord: (id: string, record: Partial<MedicalRecord>) => Promise<void>;
    deleteMedicalRecord: (id: string) => Promise<void>;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

// Configuration
const USE_BACKEND = true; // Set to false to use mock data
const DEFAULT_OWNER_ID = 1;

export function PetProvider({ children }: { children: ReactNode }) {
    const [pets, setPets] = useState<Pet[]>([]);
    const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
    const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load pets from backend on mount
    useEffect(() => {
        if (USE_BACKEND) {
            loadInitialData();
        } else {
            setPets(mockPets);
            setVaccinations(mockVaccinations);
            setMedicalRecords(mockMedicalRecords);
        }
    }, []);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            setError(null);

            // 1. Load Pets
            const petsData = await petApi.getByOwnerId(DEFAULT_OWNER_ID);

            const transformedPets = petsData.map((pet: any) => ({
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

            // 2. Load associations from all health passports
            try {
                const allPassports = await apiCall('/health');
                const allVaccs: Vaccination[] = [];
                const allMedRecs: MedicalRecord[] = [];

                allPassports.forEach((passport: any) => {
                    const petId = passport.id.toString();

                    if (passport.vaccinations) {
                        passport.vaccinations.forEach((v: any) => {
                            allVaccs.push({
                                id: v.id.toString(),
                                petId,
                                vaccineName: v.name,
                                dateGiven: v.date,
                                nextDueDate: v.nextDue,
                                veterinarian: v.provider
                            });
                        });
                    }

                    if (passport.medicalRecords) {
                        passport.medicalRecords.forEach((m: any) => {
                            allMedRecs.push({
                                id: m.id.toString(),
                                petId,
                                date: m.date,
                                type: m.type as any,
                                title: m.title,
                                description: m.description,
                                veterinarian: m.veterinarian,
                                medications: m.medications
                            });
                        });
                    }
                });

                setVaccinations(allVaccs);
                setMedicalRecords(allMedRecs);
            } catch (healthErr) {
                console.error('Error loading health data:', healthErr);
                setVaccinations(mockVaccinations);
                setMedicalRecords(mockMedicalRecords);
            }

        } catch (err) {
            console.error('Error loading data from backend:', err);
            setError('Failed to load data. Using mock data.');
            setPets(mockPets);
            setVaccinations(mockVaccinations);
            setMedicalRecords(mockMedicalRecords);
        } finally {
            setLoading(false);
        }
    };

    // Helper for API calls in context (since api.ts is already there)
    async function apiCall(endpoint: string) {
        const response = await fetch(`http://localhost:8080/api${endpoint}`);
        return response.json();
    }

    // Pet CRUD
    const addPet = async (pet: Omit<Pet, 'id'>) => {
        if (USE_BACKEND) {
            try {
                setLoading(true);
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
                throw err;
            } finally {
                setLoading(false);
            }
        } else {
            const newPet = { ...pet, id: `pet-${Date.now()}` };
            setPets(prev => [...prev, newPet as Pet]);
        }
    };

    const updatePet = async (id: string, petUpdate: Partial<Pet>) => {
        if (USE_BACKEND) {
            const backendUpdate: any = {};
            if (petUpdate.name) backendUpdate.name = petUpdate.name;
            if (petUpdate.weight) backendUpdate.weight = petUpdate.weight;
            if (petUpdate.status) backendUpdate.status = petUpdate.status.toUpperCase().replace('-', '_');

            const updated = await petApi.update(Number(id), backendUpdate);
            setPets(prev => prev.map(p => p.id === id ? { ...p, ...petUpdate } : p));
        } else {
            setPets(prev => prev.map(p => p.id === id ? { ...p, ...petUpdate } : p));
        }
    };

    const deletePet = async (id: string) => {
        if (USE_BACKEND) {
            await petApi.delete(Number(id));
        }
        setPets(prev => prev.filter(p => p.id !== id));
    };

    // Vaccination CRUD
    const addVaccination = async (petId: string, vaccination: Omit<Vaccination, 'id' | 'petId'>) => {
        if (USE_BACKEND) {
            try {
                // Using petId as passportId for now as per simple backend mapping
                const created = await vaccinationApi.create(Number(petId), {
                    name: vaccination.vaccineName,
                    date: vaccination.dateGiven,
                    nextDue: vaccination.nextDueDate,
                    provider: vaccination.veterinarian,
                    status: 'COMPLETED'
                });

                // Refresh records or add locally
                const newVac = { ...vaccination, id: `vac-${Date.now()}`, petId };
                setVaccinations(prev => [...prev, newVac as Vaccination]);
            } catch (e) { console.error(e); }
        } else {
            const newVac = { ...vaccination, id: `vac-${Date.now()}`, petId };
            setVaccinations(prev => [...prev, newVac as Vaccination]);
        }
    };

    const updateVaccination = async (id: string, vaccinationUpdate: Partial<Vaccination>) => {
        if (USE_BACKEND && !id.startsWith('vac-')) {
            await vaccinationApi.update(Number(id), vaccinationUpdate);
        }
        setVaccinations(prev => prev.map(v => v.id === id ? { ...v, ...vaccinationUpdate } : v));
    };

    const deleteVaccination = async (id: string) => {
        if (USE_BACKEND && !id.startsWith('vac-')) {
            await vaccinationApi.delete(Number(id));
        }
        setVaccinations(prev => prev.filter(v => v.id !== id));
    };

    // Medical Record CRUD
    const addMedicalRecord = async (petId: string, record: Omit<MedicalRecord, 'id' | 'petId'>) => {
        if (USE_BACKEND) {
            try {
                await medicalRecordApi.create(Number(petId), {
                    date: record.date,
                    type: record.type,
                    title: record.title,
                    description: record.description,
                    veterinarian: record.veterinarian,
                    medications: record.medications
                });

                const newRecord = { ...record, id: `med-${Date.now()}`, petId };
                setMedicalRecords(prev => [...prev, newRecord as MedicalRecord]);
            } catch (e) { console.error(e); }
        } else {
            const newRecord = { ...record, id: `med-${Date.now()}`, petId };
            setMedicalRecords(prev => [...prev, newRecord as MedicalRecord]);
        }
    };

    const updateMedicalRecord = async (id: string, recordUpdate: Partial<MedicalRecord>) => {
        if (USE_BACKEND && !id.startsWith('med-')) {
            await medicalRecordApi.update(Number(id), recordUpdate);
        }
        setMedicalRecords(prev => prev.map(r => r.id === id ? { ...r, ...recordUpdate } : r));
    };

    const deleteMedicalRecord = async (id: string) => {
        if (USE_BACKEND && !id.startsWith('med-')) {
            await medicalRecordApi.delete(Number(id));
        }
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
