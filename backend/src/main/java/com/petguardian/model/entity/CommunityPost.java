package com.petguardian.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "community_posts")
@Getter
@Setter
public class CommunityPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    private String authorName;
    private String authorAvatar;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    private int likes = 0;
    private int comments = 0;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
}
