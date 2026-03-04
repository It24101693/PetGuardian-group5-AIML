package com.petguardian.service;

import com.petguardian.model.entity.SymptomScan;

import com.petguardian.repository.PetRepository;
import com.petguardian.repository.SymptomScanRepository;
import com.petguardian.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SymptomScanService {
    private final SymptomScanRepository symptomScanRepository;
    private final PetRepository petRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public SymptomScan saveScan(SymptomScan scan) {
        SymptomScan savedScan = symptomScanRepository.save(scan);

        // Trigger notification
        try {
            petRepository.findById(scan.getPetId()).ifPresent(pet -> {
                userRepository.findById(pet.getOwnerId()).ifPresent(owner -> {
                    String title = "AI Skin Scan Complete: " + pet.getName();
                    String message = "AI detected " + scan.getDiseaseName() + " with " +
                            (int) (scan.getProbability() * 100) + "% probability. " +
                            "Severity: " + scan.getSeverity();

                    com.petguardian.model.entity.Notification.NotificationType type = scan.getSeverity()
                            .equalsIgnoreCase("Severe")
                                    ? com.petguardian.model.entity.Notification.NotificationType.EMERGENCY
                                    : com.petguardian.model.entity.Notification.NotificationType.ALERT;

                    notificationService.createNotification(owner, title, message, type);
                });
            });
        } catch (Exception e) {
            // Log error but don't fail the scan save
            System.err.println("Failed to create notification for scan: " + e.getMessage());
        }

        return savedScan;
    }

    public List<SymptomScan> getScansByPetId(Long petId) {
        return symptomScanRepository.findByPetIdOrderByCreatedAtDesc(petId);
    }

    public Optional<SymptomScan> getScanById(Long id) {
        return symptomScanRepository.findById(id);
    }

    public void deleteScan(Long id) {
        symptomScanRepository.deleteById(id);
    }

    public SymptomScan updateSeverity(Long id, String severity) {
        return symptomScanRepository.findById(id).map(scan -> {
            scan.setSeverity(severity);
            return symptomScanRepository.save(scan);
        }).orElseThrow(() -> new RuntimeException("Scan not found"));
    }
}
