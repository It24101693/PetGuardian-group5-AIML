package com.petguardian.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "vaccinations")
@Getter
@Setter
public class Vaccination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "passport_id", nullable = false)
    private PetPassport petPassport;

    @NotBlank
    @Column(nullable = false, length = 150)
    private String name;

    private LocalDate date;

    private LocalDate nextDue;

    @Column(length = 150)
    private String provider;

    @Column(length = 100)
    private String batchNo;

    @Column(length = 1000)
    private String notes;

    @Column(length = 50)
    private String status;
}
