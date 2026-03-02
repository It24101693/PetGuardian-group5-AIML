package com.petguardian.controller;

import com.petguardian.model.dto.PetPassportDTO;
import com.petguardian.service.HealthPassportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
public class HealthPassportController {

    private final HealthPassportService healthPassportService;

    @GetMapping
    public ResponseEntity<List<PetPassportDTO>> getAllPassports() {
        return ResponseEntity.ok(healthPassportService.getAllPassports());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PetPassportDTO> getPassportById(@PathVariable Long id) {
        return ResponseEntity.ok(healthPassportService.getPassportById(id));
    }

    @PostMapping
    public ResponseEntity<PetPassportDTO> createPassport(@RequestBody PetPassportDTO dto) {
        PetPassportDTO created = healthPassportService.createPassport(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PetPassportDTO> updatePassport(@PathVariable Long id, @RequestBody PetPassportDTO dto) {
        return ResponseEntity.ok(healthPassportService.updatePassport(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePassport(@PathVariable Long id) {
        healthPassportService.deletePassport(id);
        return ResponseEntity.noContent().build();
    }
}
