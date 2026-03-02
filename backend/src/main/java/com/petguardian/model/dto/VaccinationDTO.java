package com.petguardian.model.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class VaccinationDTO {
    private Long id;
    private String name;
    private LocalDate date;
    private LocalDate nextDue;
    private String provider;
    private String batchNo;
    private String notes;
    private String status;
}
