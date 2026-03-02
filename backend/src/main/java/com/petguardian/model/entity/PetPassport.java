package com.petguardian.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pet_passports")
@Getter
@Setter
public class PetPassport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String petName;

    @Column(length = 50)
    private String species;

    @Column(length = 100)
    private String breed;

    private LocalDate dateOfBirth;

    @Column(length = 20)
    private String weight;

    @Column(length = 100)
    private String color;

    @NotBlank
    @Column(nullable = false, length = 150)
    private String ownerName;

    @Column(length = 50)
    private String ownerPhone;

    @Column(length = 150)
    private String vetName;

    @Column(length = 150)
    private String vetClinic;

    @Column(length = 50)
    private String vetPhone;

    // Emergency Info flattened
    @Column(length = 20)
    private String bloodType;

    @Column(length = 100)
    private String microchipId;

    @Column(length = 1000)
    private String knownDrugAllergies;

    @Column(length = 1000)
    private String currentMedications;

    @Lob
    @Column(name = "special_instructions", columnDefinition = "LONGTEXT")
    private String specialInstructions;

    @Column(length = 150)
    private String emergencyContact;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "petPassport", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Vaccination> vaccinations = new ArrayList<>();

    @OneToMany(mappedBy = "petPassport", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Allergy> allergies = new ArrayList<>();

    public void addVaccination(Vaccination vaccination) {
        vaccinations.add(vaccination);
        vaccination.setPetPassport(this);
    }

    public void addAllergy(Allergy allergy) {
        allergies.add(allergy);
        allergy.setPetPassport(this);
    }
}
