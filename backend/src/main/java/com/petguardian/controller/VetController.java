package com.petguardian.controller;

import com.petguardian.model.entity.Vet;
import com.petguardian.service.VetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vets")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class VetController {
    private final VetService vetService;

    @PostMapping
    public ResponseEntity<Vet> createVet(@RequestBody Vet vet) {
        return ResponseEntity.ok(vetService.saveVet(vet));
    }

    @GetMapping
    public ResponseEntity<List<Vet>> getAllVets() {
        return ResponseEntity.ok(vetService.getAllVets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vet> getVetById(@PathVariable Long id) {
        return vetService.getVetById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVet(@PathVariable Long id) {
        vetService.deleteVet(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<Vet>> getNearbyVets(
            @RequestParam Double lat,
            @RequestParam Double lon,
            @RequestParam(defaultValue = "5.0") Double radius) {
        return ResponseEntity.ok(vetService.findNearbyVets(lat, lon, radius));
    }

    @GetMapping("/emergency")
    public ResponseEntity<List<Vet>> getEmergencyVets() {
        return ResponseEntity.ok(vetService.getEmergencyVets());
    }
}
