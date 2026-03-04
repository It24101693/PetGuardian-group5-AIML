package com.petguardian.repository;

import com.petguardian.model.entity.Appointment;
import com.petguardian.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUserAndAppointmentTimeBetween(User user, LocalDateTime start, LocalDateTime end);
}
