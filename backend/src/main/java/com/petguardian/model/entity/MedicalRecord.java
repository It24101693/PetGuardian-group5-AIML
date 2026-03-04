package com.petguardian.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "medical_records")
@Getter
@Setter
public class MedicalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "passport_id", nullable = false)
    private PetPassport petPassport;

    private LocalDate date;

    @Column(length = 50)
    private String type; // checkup, surgery, illness, injury

    @NotBlank
    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(length = 150)
    private String veterinarian;

    @ElementCollection
    @CollectionTable(name = "medical_record_medications", joinColumns = @JoinColumn(name = "record_id"))
    @Column(name = "medication")
    private List<String> medications;
}
