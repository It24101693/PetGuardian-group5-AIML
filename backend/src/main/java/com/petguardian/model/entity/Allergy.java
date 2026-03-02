package com.petguardian.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "allergies")
@Getter
@Setter
public class Allergy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "passport_id", nullable = false)
    private PetPassport petPassport;

    @Column(length = 50)
    private String type; // e.g. "Allergy", "Medical Condition"

    @NotBlank
    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 50)
    private String severity; // e.g. "Mild", "Moderate", "Severe"

    @Column(length = 1000)
    private String notes;
}
