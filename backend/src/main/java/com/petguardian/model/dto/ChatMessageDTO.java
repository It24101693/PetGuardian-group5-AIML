package com.petguardian.model.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChatMessageDTO {
    private Long id;
    private String content;
    private String senderId;
    private String receiverId;
    private LocalDateTime timestamp;
    private boolean isAi;
}
