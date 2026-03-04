package com.petguardian.model.dto;

import lombok.Data;

@Data
public class KnowledgeEntryDTO {
    private Long id;
    private String keyword;
    private String response;
    private String category;
}
