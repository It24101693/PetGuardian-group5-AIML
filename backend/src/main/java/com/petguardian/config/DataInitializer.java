package com.petguardian.config;

import com.petguardian.model.entity.User;
import com.petguardian.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * Seeds the predefined ADMIN account on every startup (if not already present).
 *
 * Credentials:
 * Email : admin@petguardian.com
 * Password: admin123
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;

    // ── Predefined admin credentials ──
    private static final String ADMIN_EMAIL = "admin@petguardian.com";
    private static final String ADMIN_PASSWORD = "admin123";
    private static final String ADMIN_NAME = "ADMIN";

    @Override
    public void run(ApplicationArguments args) {
        if (!userRepository.existsByEmail(ADMIN_EMAIL)) {
            User admin = new User();
            admin.setFullName(ADMIN_NAME);
            admin.setEmail(ADMIN_EMAIL);
            admin.setUsername(ADMIN_EMAIL);
            admin.setPasswordHash(ADMIN_PASSWORD); // Plain-text for now (matches existing auth approach)
            admin.setRole(User.UserRole.ADMIN);
            admin.setIsActive(true);
            admin.setEmailVerified(true);
            userRepository.save(admin);
            System.out.println("✅ Admin account seeded: " + ADMIN_EMAIL);
        } else {
            System.out.println("ℹ️  Admin account already exists.");
        }
    }
}
