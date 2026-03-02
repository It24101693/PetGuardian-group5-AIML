package com.petguardian.controller;

import com.petguardian.model.dto.VaccinationDTO;
import com.petguardian.service.HealthPassportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
public class VaccinationController {

    private final HealthPassportService service;

    @PostMapping("/{passportId}/vaccinations")
    public ResponseEntity<Void> addVaccination(@PathVariable Long passportId, @RequestBody VaccinationDTO dto) {
        service.addVaccination(passportId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/vaccinations/{id}")
    public ResponseEntity<Void> updateVaccination(@PathVariable Long id, @RequestBody VaccinationDTO dto) {
        service.updateVaccination(id, dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/vaccinations/{id}")
    public ResponseEntity<Void> deleteVaccination(@PathVariable Long id) {
        service.deleteVaccination(id);
        return ResponseEntity.noContent().build();
    }
}
