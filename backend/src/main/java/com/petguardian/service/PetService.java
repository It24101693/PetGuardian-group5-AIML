package com.petguardian.service;

import com.petguardian.model.entity.Pet;
import com.petguardian.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PetService {
    
    private final PetRepository petRepository;
    
    @Transactional(readOnly = true)
    public List<Pet> getAllPets() {
        return petRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Optional<Pet> getPetById(Long id) {
        return petRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public List<Pet> getPetsByOwnerId(Long ownerId) {
        return petRepository.findByOwnerIdAndIsActiveTrue(ownerId);
    }
    
    @Transactional
    public Pet createPet(Pet pet) {
        return petRepository.save(pet);
    }
    
    @Transactional
    public Pet updatePet(Long id, Pet petDetails) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet not found with id: " + id));
        
        pet.setName(petDetails.getName());
        pet.setSpecies(petDetails.getSpecies());
        pet.setBreed(petDetails.getBreed());
        pet.setDateOfBirth(petDetails.getDateOfBirth());
        pet.setAge(petDetails.getAge());
        pet.setGender(petDetails.getGender());
        pet.setWeight(petDetails.getWeight());
        pet.setColor(petDetails.getColor());
        pet.setMicrochipNumber(petDetails.getMicrochipNumber());
        pet.setImageUrl(petDetails.getImageUrl());
        pet.setStatus(petDetails.getStatus());
        
        return petRepository.save(pet);
    }
    
    @Transactional
    public void deletePet(Long id) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet not found with id: " + id));
        pet.setIsActive(false);
        petRepository.save(pet);
    }
}
