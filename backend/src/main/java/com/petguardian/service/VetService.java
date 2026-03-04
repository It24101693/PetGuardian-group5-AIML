package com.petguardian.service;

import com.petguardian.model.entity.Vet;
import com.petguardian.repository.VetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VetService {
    private final VetRepository vetRepository;

    public Vet saveVet(Vet vet) {
        return vetRepository.save(vet);
    }

    public List<Vet> getAllVets() {
        return vetRepository.findAll();
    }

    public Optional<Vet> getVetById(Long id) {
        return vetRepository.findById(id);
    }

    public void deleteVet(Long id) {
        vetRepository.deleteById(id);
    }

    public List<Vet> findNearbyVets(Double lat, Double lon, Double radiusKm) {
        List<Vet> allVets = vetRepository.findAll();
        return allVets.stream()
                .filter(vet -> vet.getLatitude() != null && vet.getLongitude() != null)
                .filter(vet -> calculateDistance(lat, lon, vet.getLatitude(), vet.getLongitude()) <= radiusKm)
                .collect(Collectors.toList());
    }

    public List<Vet> getEmergencyVets() {
        // Simple logic: Vets that are hospitals or open now
        return vetRepository.findAll().stream()
                .filter(v -> "Hospital".equalsIgnoreCase(v.getType()) || Boolean.TRUE.equals(v.getIsOpen()))
                .collect(Collectors.toList());
    }

    // Haversine formula to calculate distance between two points
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the earth in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                        * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
