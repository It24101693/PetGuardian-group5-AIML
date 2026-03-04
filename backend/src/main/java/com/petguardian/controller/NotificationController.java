package com.petguardian.controller;

import com.petguardian.model.entity.Notification;
import com.petguardian.model.entity.User;
import com.petguardian.service.NotificationService;
import com.petguardian.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable Long userId) {
        User user = userService.getUser(userId);
        return ResponseEntity.ok(notificationService.getAllNotificationsForUser(user));
    }

    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(@PathVariable Long userId) {
        User user = userService.getUser(userId);
        return ResponseEntity.ok(notificationService.getUnreadNotificationsForUser(user));
    }

    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<Long> getUnreadCount(@PathVariable Long userId) {
        User user = userService.getUser(userId);
        return ResponseEntity.ok(notificationService.getUnreadCount(user));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/user/{userId}/read-all")
    public ResponseEntity<Void> markAllAsRead(@PathVariable Long userId) {
        User user = userService.getUser(userId);
        notificationService.markAllAsRead(user);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok().build();
    }

    // Create a new notification
    @PostMapping
    public ResponseEntity<Void> createNotification(@RequestParam Long userId, @RequestParam String title,
            @RequestParam String message, @RequestParam Notification.NotificationType type) {
        User user = userService.getUser(userId);
        notificationService.createNotification(user, title, message, type);
        return ResponseEntity.ok().build();
    }

    // Trigger vaccination reminders for a user
    @GetMapping("/user/{userId}/check-reminders")
    public ResponseEntity<Void> checkReminders(@PathVariable Long userId) {
        User user = userService.getUser(userId);
        notificationService.checkVaccinationReminders(user);
        return ResponseEntity.ok().build();
    }
}
