package com.petguardian.controller;

import com.petguardian.model.dto.MedicalRecordDTO;
import com.petguardian.service.HealthPassportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
public class MedicalRecordController {

    private final HealthPassportService service;

    @PostMapping("/{passportId}/records")
    public ResponseEntity<Void> addMedicalRecord(@PathVariable Long passportId, @RequestBody MedicalRecordDTO dto) {
        service.addMedicalRecord(passportId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/records/{id}")
    public ResponseEntity<Void> updateMedicalRecord(@PathVariable Long id, @RequestBody MedicalRecordDTO dto) {
        service.updateMedicalRecord(id, dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/records/{id}")
    public ResponseEntity<Void> deleteMedicalRecord(@PathVariable Long id) {
        service.deleteMedicalRecord(id);
        return ResponseEntity.noContent().build();
    }
}
