package com.petguardian.repository;

import com.petguardian.model.entity.PetPassport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PetPassportRepository extends JpaRepository<PetPassport, Long> {
    List<PetPassport> findByOwnerName(String ownerName);
}
