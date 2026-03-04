package com.petguardian.service;

import com.petguardian.model.dto.CommunityPostDTO;
import com.petguardian.model.entity.CommunityPost;
import com.petguardian.model.entity.User;
import com.petguardian.repository.CommunityPostRepository;
import com.petguardian.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommunityService {

    private final CommunityPostRepository communityPostRepository;
    private final UserRepository userRepository;

    public List<CommunityPostDTO> getAllPosts() {
        return communityPostRepository.findAllByOrderByTimestampDesc()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommunityPostDTO createPost(CommunityPostDTO dto) {
        CommunityPost post = new CommunityPost();
        post.setContent(dto.getContent());

        User author = userRepository.findById(dto.getAuthorId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        post.setAuthor(author);
        post.setAuthorName(author.getFullName());
        post.setAuthorAvatar(author.getProfileImageUrl());

        CommunityPost saved = communityPostRepository.save(post);
        return mapToDTO(saved);
    }

    @Transactional
    public CommunityPostDTO updatePost(Long id, CommunityPostDTO dto) {
        CommunityPost post = communityPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setContent(dto.getContent());
        return mapToDTO(communityPostRepository.save(post));
    }

    @Transactional
    public void deletePost(Long id) {
        communityPostRepository.deleteById(id);
    }

    private CommunityPostDTO mapToDTO(CommunityPost post) {
        CommunityPostDTO dto = new CommunityPostDTO();
        dto.setId(post.getId());
        dto.setContent(post.getContent());
        dto.setAuthorId(post.getAuthor().getId());
        dto.setAuthorName(post.getAuthorName());
        dto.setAuthorAvatar(post.getAuthorAvatar());
        dto.setTimestamp(post.getTimestamp());
        dto.setLikes(post.getLikes());
        dto.setComments(post.getComments());
        return dto;
    }
}
