package com.petguardian.service;

import com.petguardian.model.entity.Appointment;
import com.petguardian.model.entity.Notification;
import com.petguardian.model.entity.PetPassport;
import com.petguardian.model.entity.User;
import com.petguardian.model.entity.Vaccination;
import com.petguardian.repository.AppointmentRepository;
import com.petguardian.repository.NotificationRepository;
import com.petguardian.repository.PetPassportRepository;
import com.petguardian.repository.VaccinationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final PetPassportRepository petPassportRepository;
    private final VaccinationRepository vaccinationRepository;
    private final AppointmentRepository appointmentRepository;

    public List<Notification> getAllNotificationsForUser(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Notification> getUnreadNotificationsForUser(User user) {
        return notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user);
    }

    public long getUnreadCount(User user) {
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    @Transactional
    public void createNotification(User user, String title, String message, Notification.NotificationType type) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
    }

    @Transactional
    public void markAllAsRead(User user) {
        List<Notification> unread = notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user);
        unread.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unread);
    }

    @Transactional
    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }

    @Transactional
    public void checkVaccinationReminders(User user) {
        if (user.getFullName() == null)
            return;

        List<PetPassport> passports = petPassportRepository.findByOwnerName(user.getFullName());
        LocalDate now = LocalDate.now();
        LocalDate inOneWeek = now.plusDays(7);

        for (PetPassport passport : passports) {
            List<Vaccination> upcoming = vaccinationRepository.findByNextDueBetweenAndStatusNot(
                    now, inOneWeek, "COMPLETED");

            for (Vaccination v : upcoming) {
                if (v.getPetPassport().getId().equals(passport.getId())) {
                    String title = "Vaccination Reminder: " + passport.getPetName();
                    String message = v.getName() + " is due on " + v.getNextDue() + ". Please schedule an appointment.";

                    // Avoid duplicate notifications (simple check)
                    boolean alreadyNotified = notificationRepository.findByUserOrderByCreatedAtDesc(user)
                            .stream()
                            .anyMatch(n -> n.getTitle().equals(title) && !n.getIsRead());

                    if (!alreadyNotified) {
                        createNotification(user, title, message, Notification.NotificationType.VACCINATION);
                    }
                }
            }
        }
    }

    @Transactional
    public void checkAndSendReminders(User user) {
        checkVaccinationReminders(user);
        checkAppointmentReminders(user);
    }

    @Transactional
    public void checkAppointmentReminders(User user) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime tomorrow = now.plusDays(1);

        List<Appointment> upcoming = appointmentRepository.findByUserAndAppointmentTimeBetween(
                user, now, tomorrow);

        for (Appointment appt : upcoming) {
            String title = "Vet Appointment Tomorrow: " + appt.getPetName();
            String timeStr = appt.getAppointmentTime().toLocalTime().toString();
            String message = "Your appointment with " + appt.getVeterinarianName() + " is at " + timeStr + ".";

            // Avoid duplicates
            boolean alreadyNotified = notificationRepository.findByUserOrderByCreatedAtDesc(user)
                    .stream()
                    .anyMatch(n -> n.getTitle().equals(title) && !n.getIsRead());

            if (!alreadyNotified) {
                createNotification(user, title, message, Notification.NotificationType.APPOINTMENT);
            }
        }
    }
}
