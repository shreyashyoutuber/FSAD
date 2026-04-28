package com.bharathome.database.controller;

import com.bharathome.database.repository.UserRepository;
import com.bharathome.database.repository.EstimationRepository;
import com.bharathome.database.security.JwtUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final EstimationRepository estimationRepository;
    private final JwtUtils jwtUtils;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    public AdminController(UserRepository userRepository, EstimationRepository estimationRepository, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.estimationRepository = estimationRepository;
        this.jwtUtils = jwtUtils;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Admin Login — validates credentials and returns JWT token
    // ─────────────────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body("Email and password are required.");
        }

        if (!email.equalsIgnoreCase(adminEmail) || !password.equals(adminPassword)) {
            return ResponseEntity.status(401).body("Invalid admin credentials.");
        }

        String token = jwtUtils.generateToken(adminEmail);
        return ResponseEntity.ok(Map.of(
            "token", token,
            "email", adminEmail,
            "role", "ADMIN"
        ));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Clear all data (protected — requires JWT in header)
    // ─────────────────────────────────────────────────────────────────────────
    @PostMapping("/clear-data")
    public ResponseEntity<?> clearDatabase() {
        try {
            estimationRepository.deleteAll();
            userRepository.deleteAll();
            System.out.println("PLATFORM RESET: All users and estimations cleared by admin.");
            return ResponseEntity.ok("Database cleared successfully. All users and estimations removed.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to clear database: " + e.getMessage());
        }
    }
}
