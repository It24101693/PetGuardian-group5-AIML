package com.petguardian.service;

import com.petguardian.model.dto.AllergyDTO;
import com.petguardian.model.dto.MedicalRecordDTO;
import com.petguardian.model.dto.PetPassportDTO;
import com.petguardian.model.dto.VaccinationDTO;
import com.petguardian.model.entity.Allergy;
import com.petguardian.model.entity.MedicalRecord;
import com.petguardian.model.entity.PetPassport;
import com.petguardian.model.entity.Vaccination;
import com.petguardian.repository.AllergyRepository;
import com.petguardian.repository.MedicalRecordRepository;
import com.petguardian.repository.PetPassportRepository;
import com.petguardian.repository.VaccinationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HealthPassportService {

    private final PetPassportRepository passportRepository;
    private final VaccinationRepository vaccinationRepository;
    private final AllergyRepository allergyRepository;
    private final MedicalRecordRepository medicalRecordRepository;

    @Transactional(readOnly = true)
    public List<PetPassportDTO> getAllPassports() {
        return passportRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PetPassportDTO getPassportById(Long id) {
        PetPassport passport = passportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Passport not found"));
        return mapToDTO(passport);
    }

    @Transactional
    public PetPassportDTO createPassport(PetPassportDTO dto) {
        PetPassport passport = new PetPassport();
        mapToEntity(dto, passport);

        // Map initial collections if provided
        if (dto.getVaccinations() != null) {
            dto.getVaccinations().forEach(vDto -> {
                Vaccination v = new Vaccination();
                mapVaccToEntity(vDto, v);
                passport.addVaccination(v);
            });
        }
        if (dto.getAllergies() != null) {
            dto.getAllergies().forEach(aDto -> {
                Allergy a = new Allergy();
                mapAllergyToEntity(aDto, a);
                passport.addAllergy(a);
            });
        }
        if (dto.getMedicalRecords() != null) {
            dto.getMedicalRecords().forEach(mDto -> {
                MedicalRecord m = new MedicalRecord();
                mapMedicalRecordToEntity(mDto, m);
                passport.addMedicalRecord(m);
            });
        }

        PetPassport saved = passportRepository.save(passport);
        return mapToDTO(saved);
    }

    @Transactional
    public PetPassportDTO updatePassport(Long id, PetPassportDTO dto) {
        PetPassport passport = passportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Passport not found"));
        mapToEntity(dto, passport);
        // Only updates main passport fields, separate methods handle the collections
        PetPassport saved = passportRepository.save(passport);
        return mapToDTO(saved);
    }

    @Transactional
    public void deletePassport(Long id) {
        passportRepository.deleteById(id);
    }

    // --- Sub-resource Operations ---

    @Transactional
    public void addVaccination(Long passportId, VaccinationDTO dto) {
        PetPassport passport = passportRepository.findById(passportId).orElseThrow();
        Vaccination v = new Vaccination();
        mapVaccToEntity(dto, v);
        passport.addVaccination(v);
        passportRepository.save(passport);
    }

    @Transactional
    public void updateVaccination(Long id, VaccinationDTO dto) {
        Vaccination v = vaccinationRepository.findById(id).orElseThrow();
        mapVaccToEntity(dto, v);
        vaccinationRepository.save(v);
    }

    @Transactional
    public void deleteVaccination(Long id) {
        vaccinationRepository.deleteById(id);
    }

    @Transactional
    public void addAllergy(Long passportId, AllergyDTO dto) {
        PetPassport passport = passportRepository.findById(passportId).orElseThrow();
        Allergy a = new Allergy();
        mapAllergyToEntity(dto, a);
        passport.addAllergy(a);
        passportRepository.save(passport);
    }

    @Transactional
    public void updateAllergy(Long id, AllergyDTO dto) {
        Allergy a = allergyRepository.findById(id).orElseThrow();
        mapAllergyToEntity(dto, a);
        allergyRepository.save(a);
    }

    @Transactional
    public void deleteAllergy(Long id) {
        allergyRepository.deleteById(id);
    }

    @Transactional
    public void addMedicalRecord(Long passportId, MedicalRecordDTO dto) {
        PetPassport passport = passportRepository.findById(passportId).orElseThrow();
        MedicalRecord m = new MedicalRecord();
        mapMedicalRecordToEntity(dto, m);
        passport.addMedicalRecord(m);
        passportRepository.save(passport);
    }

    @Transactional
    public void updateMedicalRecord(Long id, MedicalRecordDTO dto) {
        MedicalRecord m = medicalRecordRepository.findById(id).orElseThrow();
        mapMedicalRecordToEntity(dto, m);
        medicalRecordRepository.save(m);
    }

    @Transactional
    public void deleteMedicalRecord(Long id) {
        medicalRecordRepository.deleteById(id);
    }

    // --- Mapping Helpers ---

    private void mapToEntity(PetPassportDTO dto, PetPassport e) {
        e.setPetName(dto.getPetName());
        e.setSpecies(dto.getSpecies());
        e.setBreed(dto.getBreed());
        e.setDateOfBirth(dto.getDateOfBirth());
        e.setWeight(dto.getWeight());
        e.setColor(dto.getColor());
        e.setOwnerName(dto.getOwnerName());
        e.setOwnerPhone(dto.getOwnerPhone());
        e.setVetName(dto.getVetName());
        e.setVetClinic(dto.getVetClinic());
        e.setVetPhone(dto.getVetPhone());
        // Emergency mapping
        if (dto.getBloodType() != null)
            e.setBloodType(dto.getBloodType());
        if (dto.getMicrochipId() != null)
            e.setMicrochipId(dto.getMicrochipId());
        if (dto.getKnownDrugAllergies() != null)
            e.setKnownDrugAllergies(dto.getKnownDrugAllergies());
        if (dto.getCurrentMedications() != null)
            e.setCurrentMedications(dto.getCurrentMedications());
        if (dto.getSpecialInstructions() != null)
            e.setSpecialInstructions(dto.getSpecialInstructions());
        if (dto.getEmergencyContact() != null)
            e.setEmergencyContact(dto.getEmergencyContact());
    }

    private PetPassportDTO mapToDTO(PetPassport e) {
        PetPassportDTO dto = new PetPassportDTO();
        dto.setId(e.getId());
        dto.setPetName(e.getPetName());
        dto.setSpecies(e.getSpecies());
        dto.setBreed(e.getBreed());
        dto.setDateOfBirth(e.getDateOfBirth());
        dto.setWeight(e.getWeight());
        dto.setColor(e.getColor());
        dto.setOwnerName(e.getOwnerName());
        dto.setOwnerPhone(e.getOwnerPhone());
        dto.setVetName(e.getVetName());
        dto.setVetClinic(e.getVetClinic());
        dto.setVetPhone(e.getVetPhone());
        dto.setBloodType(e.getBloodType());
        dto.setMicrochipId(e.getMicrochipId());
        dto.setKnownDrugAllergies(e.getKnownDrugAllergies());
        dto.setCurrentMedications(e.getCurrentMedications());
        dto.setSpecialInstructions(e.getSpecialInstructions());
        dto.setEmergencyContact(e.getEmergencyContact());

        if (e.getVaccinations() != null) {
            dto.setVaccinations(e.getVaccinations().stream().map(this::mapVaccToDTO).collect(Collectors.toList()));
        }
        if (e.getAllergies() != null) {
            dto.setAllergies(e.getAllergies().stream().map(this::mapAllergyToDTO).collect(Collectors.toList()));
        }
        if (e.getMedicalRecords() != null) {
            dto.setMedicalRecords(
                    e.getMedicalRecords().stream().map(this::mapMedicalRecordToDTO).collect(Collectors.toList()));
        }
        return dto;
    }

    private void mapVaccToEntity(VaccinationDTO dto, Vaccination e) {
        e.setName(dto.getName());
        e.setDate(dto.getDate());
        e.setNextDue(dto.getNextDue());
        e.setProvider(dto.getProvider());
        e.setBatchNo(dto.getBatchNo());
        e.setNotes(dto.getNotes());
        e.setStatus(dto.getStatus());
    }

    private VaccinationDTO mapVaccToDTO(Vaccination e) {
        VaccinationDTO dto = new VaccinationDTO();
        dto.setId(e.getId());
        dto.setName(e.getName());
        dto.setDate(e.getDate());
        dto.setNextDue(e.getNextDue());
        dto.setProvider(e.getProvider());
        dto.setBatchNo(e.getBatchNo());
        dto.setNotes(e.getNotes());
        dto.setStatus(e.getStatus());
        return dto;
    }

    private void mapAllergyToEntity(AllergyDTO dto, Allergy e) {
        e.setType(dto.getType());
        e.setName(dto.getName());
        e.setSeverity(dto.getSeverity());
        e.setNotes(dto.getNotes());
    }

    private AllergyDTO mapAllergyToDTO(Allergy e) {
        AllergyDTO dto = new AllergyDTO();
        dto.setId(e.getId());
        dto.setType(e.getType());
        dto.setName(e.getName());
        dto.setSeverity(e.getSeverity());
        dto.setNotes(e.getNotes());
        return dto;
    }

    private void mapMedicalRecordToEntity(MedicalRecordDTO dto, MedicalRecord e) {
        e.setDate(dto.getDate());
        e.setType(dto.getType());
        e.setTitle(dto.getTitle());
        e.setDescription(dto.getDescription());
        e.setVeterinarian(dto.getVeterinarian());
        e.setMedications(dto.getMedications());
    }

    private MedicalRecordDTO mapMedicalRecordToDTO(MedicalRecord e) {
        MedicalRecordDTO dto = new MedicalRecordDTO();
        dto.setId(e.getId());
        dto.setDate(e.getDate());
        dto.setType(e.getType());
        dto.setTitle(e.getTitle());
        dto.setDescription(e.getDescription());
        dto.setVeterinarian(e.getVeterinarian());
        dto.setMedications(e.getMedications());
        return dto;
    }
}
