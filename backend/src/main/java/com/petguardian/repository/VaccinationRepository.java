package com.petguardian.repository;

import com.petguardian.model.entity.Vaccination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VaccinationRepository extends JpaRepository<Vaccination, Long> {
    List<Vaccination> findByNextDueBetweenAndStatusNot(LocalDate start, LocalDate end, String status);
}
