package com.petguardian.controller;

import com.petguardian.model.dto.AllergyDTO;
import com.petguardian.service.HealthPassportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
public class AllergyController {

    private final HealthPassportService service;

    @PostMapping("/{passportId}/allergies")
    public ResponseEntity<Void> addAllergy(@PathVariable Long passportId, @RequestBody AllergyDTO dto) {
        service.addAllergy(passportId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/allergies/{id}")
    public ResponseEntity<Void> updateAllergy(@PathVariable Long id, @RequestBody AllergyDTO dto) {
        service.updateAllergy(id, dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/allergies/{id}")
    public ResponseEntity<Void> deleteAllergy(@PathVariable Long id) {
        service.deleteAllergy(id);
        return ResponseEntity.noContent().build();
    }
}
