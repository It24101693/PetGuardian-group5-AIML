package com.petguardian.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_symptom_scans")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SymptomScan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pet_id", nullable = false)
    private Long petId;

    @Column(name = "image_url", columnDefinition = "LONGTEXT")
    private String imageUrl;

    @Column(name = "disease_name")
    private String diseaseName;

    @Column(name = "probability")
    private Double probability;

    @Column(name = "severity")
    private String severity;

    @Column(name = "precautionary_advice", columnDefinition = "TEXT")
    private String precautionaryAdvice;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
