package com.petguardian.controller;

import com.petguardian.model.dto.ChatMessageDTO;
import com.petguardian.model.dto.KnowledgeEntryDTO;
import com.petguardian.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/history/{userId1}/{userId2}")
    public ResponseEntity<List<ChatMessageDTO>> getChatHistory(
            @PathVariable String userId1, @PathVariable String userId2) {
        return ResponseEntity.ok(chatService.getChatHistory(userId1, userId2));
    }

    @GetMapping("/ai/history/{userId}")
    public ResponseEntity<List<ChatMessageDTO>> getAiHistory(@PathVariable String userId) {
        return ResponseEntity.ok(chatService.getAiChatHistory(userId));
    }

    @PostMapping("/send")
    public ResponseEntity<ChatMessageDTO> sendMessage(@RequestBody ChatMessageDTO dto) {
        return ResponseEntity.ok(chatService.sendMessage(dto));
    }

    @PostMapping("/ai/query/{userId}")
    public ResponseEntity<ChatMessageDTO> queryAi(@PathVariable String userId, @RequestBody String query) {
        return ResponseEntity.ok(chatService.processAiQuery(userId, query));
    }

    // Admin Knowledge Base Endpoints
    @GetMapping("/admin/knowledge")
    public ResponseEntity<List<KnowledgeEntryDTO>> getAllKnowledge() {
        return ResponseEntity.ok(chatService.getAllKnowledge());
    }

    @PostMapping("/admin/knowledge")
    public ResponseEntity<KnowledgeEntryDTO> addKnowledge(@RequestBody KnowledgeEntryDTO dto) {
        return ResponseEntity.ok(chatService.addKnowledge(dto));
    }
}
