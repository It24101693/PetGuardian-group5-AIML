package com.petguardian.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "vet")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type; // e.g. "Doctor", "Hospital", "Clinic"

    @Column
    private String specialty;

    @Column
    private String address;

    @Column
    private Double rating;

    @Column
    private Integer reviews;

    @Column
    private String phone;

    @Column
    private Boolean isOpen;

    @Column
    private Boolean verified;

    @Column
    private Boolean aiRecommended;
}
