package com.petguardian.service;

import com.petguardian.dto.AuthDTOs;
import com.petguardian.model.entity.User;
import com.petguardian.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public User registerUser(AuthDTOs.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setFullName(request.getName());
        user.setEmail(request.getEmail());
        user.setUsername(request.getEmail()); // Use email as username for now
        user.setPasswordHash(request.getPassword()); // In a real app, use BCrypt

        if ("vet".equalsIgnoreCase(request.getRole())) {
            user.setRole(User.UserRole.VETERINARIAN);
            // In a real app, we'd store clinicId somewhere or use it for validation
        } else {
            user.setRole(User.UserRole.OWNER);
        }

        return userRepository.save(user);
    }

    public User authenticate(String email, String password, String role) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Basic password check
            if (user.getPasswordHash().equals(password)) {
                // Admin can log in regardless of which role tab was selected
                if (user.getRole() == User.UserRole.ADMIN) {
                    return user;
                }
                // For owners and vets, optionally verify role matches
                return user;
            }
        }

        throw new RuntimeException("Invalid credentials");
    }

    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public User updateUserRole(Long id, User.UserRole role) {
        User user = getUser(id);
        user.setRole(role);
        return userRepository.save(user);
    }

    @Transactional
    public User deactivateUser(Long id) {
        User user = getUser(id);
        user.setIsActive(false);
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = getUser(id);
        userRepository.delete(user);
    }
}
