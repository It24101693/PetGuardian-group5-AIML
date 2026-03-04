package com.petguardian.controller;

import com.petguardian.model.entity.SymptomScan;
import com.petguardian.service.SymptomScanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/symptom-scans")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SymptomScanController {
    private final SymptomScanService symptomScanService;

    @PostMapping
    public ResponseEntity<SymptomScan> saveScan(@RequestBody SymptomScan scan) {
        return ResponseEntity.ok(symptomScanService.saveScan(scan));
    }

    @GetMapping("/pet/{petId}")
    public ResponseEntity<List<SymptomScan>> getScansByPetId(@PathVariable Long petId) {
        return ResponseEntity.ok(symptomScanService.getScansByPetId(petId));
    }

    @PatchMapping("/{id}/severity")
    public ResponseEntity<SymptomScan> updateSeverity(@PathVariable Long id, @RequestBody String severity) {
        return ResponseEntity.ok(symptomScanService.updateSeverity(id, severity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScan(@PathVariable Long id) {
        symptomScanService.deleteScan(id);
        return ResponseEntity.noContent().build();
    }
}
