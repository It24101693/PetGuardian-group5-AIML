package com.petguardian.repository;

import com.petguardian.model.entity.PetPassport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PetPassportRepository extends JpaRepository<PetPassport, Long> {
}
