package com.petguardian.model.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class MedicalRecordDTO {
    private Long id;
    private LocalDate date;
    private String type; // checkup, surgery, illness, injury
    private String title;
    private String description;
    private String veterinarian;
    private List<String> medications;
}
