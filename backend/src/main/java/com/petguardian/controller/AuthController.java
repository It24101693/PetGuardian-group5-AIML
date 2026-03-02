package com.petguardian.controller;

import com.petguardian.dto.AuthDTOs;
import com.petguardian.model.entity.User;
import com.petguardian.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // Basic CORS for now
public class AuthController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<AuthDTOs.AuthResponse> login(@RequestBody AuthDTOs.LoginRequest request) {
        User user = userService.authenticate(request.getEmail(), request.getPassword(), request.getRole());
        return ResponseEntity.ok(convertToResponse(user));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthDTOs.AuthResponse> register(@RequestBody AuthDTOs.RegisterRequest request) {
        User user = userService.registerUser(request);
        return ResponseEntity.ok(convertToResponse(user));
    }

    private AuthDTOs.AuthResponse convertToResponse(User user) {
        AuthDTOs.AuthResponse response = new AuthDTOs.AuthResponse();
        response.setId(user.getId());
        response.setName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name().toLowerCase());
        // clinicId could be retrieved if needed
        response.setToken("mock-jwt-token"); // Placeholder
        return response;
    }
}
