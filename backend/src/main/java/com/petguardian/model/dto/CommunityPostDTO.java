package com.petguardian.model.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommunityPostDTO {
    private Long id;
    private String content;
    private Long authorId;
    private String authorName;
    private String authorAvatar;
    private LocalDateTime timestamp;
    private int likes;
    private int comments;
}
