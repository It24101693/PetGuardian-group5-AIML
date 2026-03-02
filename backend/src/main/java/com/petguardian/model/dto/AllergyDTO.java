package com.petguardian.model.dto;

import lombok.Data;

@Data
public class AllergyDTO {
    private Long id;
    private String type;
    private String name;
    private String severity;
    private String notes;
}
