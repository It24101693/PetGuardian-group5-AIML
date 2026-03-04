package com.petguardian.repository;

import com.petguardian.model.entity.SymptomScan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SymptomScanRepository extends JpaRepository<SymptomScan, Long> {
    List<SymptomScan> findByPetIdOrderByCreatedAtDesc(Long petId);
}
