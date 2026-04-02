package com.bharathome.database.controller;

import com.bharathome.database.repository.UserRepository;
import com.bharathome.database.repository.EstimationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final EstimationRepository estimationRepository;

    public AdminController(UserRepository userRepository, EstimationRepository estimationRepository) {
        this.userRepository = userRepository;
        this.estimationRepository = estimationRepository;
    }

    @PostMapping("/clear-data")
    public ResponseEntity<?> clearDatabase() {
        try {
            // Irreversible cleanup for testing
            estimationRepository.deleteAll();
            userRepository.deleteAll();

            System.out.println("PLATFORM RESET: All users and estimations have been cleared by admin.");
            return ResponseEntity.ok("Database cleared successfully. All users and estimations removed.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to clear database: " + e.getMessage());
        }
    }
}
