package com.petguardian.model.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
public class PetPassportDTO {
    private Long id;
    private String petName;
    private String species;
    private String breed;
    private LocalDate dateOfBirth;
    private String weight;
    private String color;
    private String ownerName;
    private String ownerPhone;
    private String vetName;
    private String vetClinic;
    private String vetPhone;
    private String bloodType;
    private String microchipId;
    private String knownDrugAllergies;
    private String currentMedications;
    private String specialInstructions;
    private String emergencyContact;

    private List<VaccinationDTO> vaccinations = new ArrayList<>();
    private List<AllergyDTO> allergies = new ArrayList<>();
    private List<MedicalRecordDTO> medicalRecords = new ArrayList<>();
}
