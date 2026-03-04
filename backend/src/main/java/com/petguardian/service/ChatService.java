package com.petguardian.service;

import com.petguardian.model.dto.ChatMessageDTO;
import com.petguardian.model.dto.KnowledgeEntryDTO;
import com.petguardian.model.entity.ChatMessage;
import com.petguardian.model.entity.KnowledgeEntry;
import com.petguardian.repository.ChatMessageRepository;
import com.petguardian.repository.KnowledgeEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final KnowledgeEntryRepository knowledgeEntryRepository;

    public List<ChatMessageDTO> getChatHistory(String userId1, String userId2) {
        return chatMessageRepository.findBySenderIdAndReceiverIdOrSenderIdAndReceiverIdOrderByTimestampAsc(
                userId1, userId2, userId2, userId1)
                .stream()
                .map(this::mapMessageToDTO)
                .collect(Collectors.toList());
    }

    public List<ChatMessageDTO> getAiChatHistory(String userId) {
        return chatMessageRepository.findBySenderIdAndReceiverIdOrSenderIdAndReceiverIdOrderByTimestampAsc(
                userId, "assistant", "assistant", userId)
                .stream()
                .map(this::mapMessageToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ChatMessageDTO sendMessage(ChatMessageDTO dto) {
        ChatMessage message = new ChatMessage();
        message.setContent(dto.getContent());
        message.setSenderId(dto.getSenderId());
        message.setReceiverId(dto.getReceiverId());
        message.setAi(dto.isAi());

        ChatMessage saved = chatMessageRepository.save(message);
        return mapMessageToDTO(saved);
    }

    @Transactional
    public ChatMessageDTO processAiQuery(String userId, String query) {
        // Save user message
        ChatMessage userMsg = new ChatMessage();
        userMsg.setContent(query);
        userMsg.setSenderId(userId);
        userMsg.setReceiverId("assistant");
        userMsg.setAi(true);
        chatMessageRepository.save(userMsg);

        // Find response in knowledge base
        String response = findKnowledgeResponse(query);

        // Save AI response
        ChatMessage aiMsg = new ChatMessage();
        aiMsg.setContent(response);
        aiMsg.setSenderId("assistant");
        aiMsg.setReceiverId(userId);
        aiMsg.setAi(true);
        ChatMessage savedAi = chatMessageRepository.save(aiMsg);

        return mapMessageToDTO(savedAi);
    }

    private String findKnowledgeResponse(String query) {
        String lowerQuery = query.toLowerCase();

        return knowledgeEntryRepository.findAll().stream()
                .filter(entry -> lowerQuery.contains(entry.getKeyword().toLowerCase()))
                .findFirst()
                .map(KnowledgeEntry::getResponse)
                .orElse("I'm not sure about that. Please consult a veterinarian for specific medical concerns.");
    }

    // Admin Knowledge Management
    public List<KnowledgeEntryDTO> getAllKnowledge() {
        return knowledgeEntryRepository.findAll().stream()
                .map(this::mapKnowledgeToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public KnowledgeEntryDTO addKnowledge(KnowledgeEntryDTO dto) {
        KnowledgeEntry entry = new KnowledgeEntry();
        entry.setKeyword(dto.getKeyword());
        entry.setResponse(dto.getResponse());
        entry.setCategory(dto.getCategory());
        return mapKnowledgeToDTO(knowledgeEntryRepository.save(entry));
    }

    private ChatMessageDTO mapMessageToDTO(ChatMessage m) {
        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setId(m.getId());
        dto.setContent(m.getContent());
        dto.setSenderId(m.getSenderId());
        dto.setReceiverId(m.getReceiverId());
        dto.setTimestamp(m.getTimestamp());
        dto.setAi(m.isAi());
        return dto;
    }

    private KnowledgeEntryDTO mapKnowledgeToDTO(KnowledgeEntry e) {
        KnowledgeEntryDTO dto = new KnowledgeEntryDTO();
        dto.setId(e.getId());
        dto.setKeyword(e.getKeyword());
        dto.setResponse(e.getResponse());
        dto.setCategory(e.getCategory());
        return dto;
    }
}
