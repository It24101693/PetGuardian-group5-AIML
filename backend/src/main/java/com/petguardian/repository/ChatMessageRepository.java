package com.petguardian.repository;

import com.petguardian.model.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findBySenderIdAndReceiverIdOrSenderIdAndReceiverIdOrderByTimestampAsc(
            String senderId1, String receiverId1, String senderId2, String receiverId2);

    List<ChatMessage> findByReceiverIdOrderByTimestampAsc(String receiverId);
}
