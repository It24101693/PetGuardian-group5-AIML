package com.petguardian.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Getter
@Setter
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2000)
    private String content;

    @Column(nullable = false)
    private String senderId; // Can be user ID or 'assistant'

    @Column(nullable = false)
    private String receiverId; // Can be user ID or 'assistant' or 'all' for community/bulk

    @Column(nullable = false)
    private LocalDateTime timestamp;

    private boolean isAi = false;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
}
