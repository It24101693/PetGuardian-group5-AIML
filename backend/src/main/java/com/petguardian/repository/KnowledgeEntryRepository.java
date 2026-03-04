package com.petguardian.repository;

import com.petguardian.model.entity.KnowledgeEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface KnowledgeEntryRepository extends JpaRepository<KnowledgeEntry, Long> {
    Optional<KnowledgeEntry> findByKeywordIgnoreCase(String keyword);
}
