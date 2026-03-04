package com.petguardian.controller;

import com.petguardian.model.dto.CommunityPostDTO;
import com.petguardian.service.CommunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityService communityService;

    @GetMapping
    public ResponseEntity<List<CommunityPostDTO>> getAllPosts() {
        return ResponseEntity.ok(communityService.getAllPosts());
    }

    @PostMapping
    public ResponseEntity<CommunityPostDTO> createPost(@RequestBody CommunityPostDTO dto) {
        return ResponseEntity.ok(communityService.createPost(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommunityPostDTO> updatePost(@PathVariable Long id, @RequestBody CommunityPostDTO dto) {
        return ResponseEntity.ok(communityService.updatePost(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        communityService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}
