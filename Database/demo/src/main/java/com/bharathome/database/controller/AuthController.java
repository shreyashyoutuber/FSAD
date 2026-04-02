package com.bharathome.database.controller;

import com.bharathome.database.model.User;
import com.bharathome.database.repository.UserRepository;
import com.bharathome.database.service.EmailService;
import com.bharathome.database.service.OtpService;
import com.bharathome.database.security.JwtUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final OtpService otpService;
    private final EmailService emailService;
    private final JwtUtils jwtUtils;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, OtpService otpService, EmailService emailService,
            JwtUtils jwtUtils, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.otpService = otpService;
        this.emailService = emailService;
        this.jwtUtils = jwtUtils;
        this.passwordEncoder = passwordEncoder;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 1: Send OTP to email (called before form submission)
    // ─────────────────────────────────────────────────────────────────────────
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String name = body.getOrDefault("name", "User");

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body("Email is required.");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("This email is already registered.");
        }

        try {
            String otp = otpService.generateAndStoreOtp(email);
            emailService.sendOtpEmail(email, name, otp);
            return ResponseEntity.ok("OTP sent successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send OTP: " + e.getMessage());
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 2: Verify OTP
    // ─────────────────────────────────────────────────────────────────────────
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp = body.get("otp");

        if (email == null || otp == null) {
            return ResponseEntity.badRequest().body("Email and OTP are required.");
        }
        if (otpService.verifyOtp(email, otp)) {
            return ResponseEntity.ok("OTP verified successfully.");
        }
        return ResponseEntity.badRequest().body("Invalid or expired OTP. Please try again.");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 3: Register (after OTP verified) - generates auto-password & sends email
    // ─────────────────────────────────────────────────────────────────────────
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered.");
        }

        // Generate strong unique default password
        String rawPassword = generateSecurePassword();

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPhone(phone);
        user.setPassword(passwordEncoder.encode(rawPassword));
        userRepository.save(user);

        // Generate JWT token
        String token = jwtUtils.generateToken(email);

        try {
            emailService.sendWelcomeEmail(email, name, rawPassword);
        } catch (Exception e) {
            // User is saved; email failure shouldn't rollback registration
            System.err.println("Welcome email failed: " + e.getMessage());
        }

        return ResponseEntity.ok(Map.of(
                "message", "Account created! Check your email for your login credentials.",
                "token", token,
                "name", user.getName(),
                "email", user.getEmail(),
                "phone", user.getPhone() != null ? user.getPhone() : ""));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Login
    // ─────────────────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                String token = jwtUtils.generateToken(email);
                return ResponseEntity.ok(Map.of(
                        "token", token,
                        "name", user.getName(),
                        "email", user.getEmail(),
                        "phone", user.getPhone() != null ? user.getPhone() : "",
                        "id", user.getId()));
            }
        }
        return ResponseEntity.status(401).body("Invalid email or password.");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Forgot Password - Request reset email
    // ─────────────────────────────────────────────────────────────────────────
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        Optional<User> userOptional = userRepository.findByEmail(email);

        // Always return OK to avoid email enumeration
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String token = UUID.randomUUID().toString();
            user.setResetToken(token);
            user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
            userRepository.save(user);

            try {
                emailService.sendPasswordResetEmail(email, user.getName(), token);
            } catch (Exception e) {
                System.err.println("Reset email failed: " + e.getMessage());
            }
        }
        return ResponseEntity.ok("If that email exists, a reset link has been sent.");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Reset Password - using token from email link
    // ─────────────────────────────────────────────────────────────────────────
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");

        if (token == null || newPassword == null || newPassword.length() < 6) {
            return ResponseEntity.badRequest().body("Token and a valid password (min 6 chars) are required.");
        }

        Optional<User> userOptional = userRepository.findByResetToken(token);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid or expired reset link.");
        }

        User user = userOptional.get();
        if (LocalDateTime.now().isAfter(user.getResetTokenExpiry())) {
            return ResponseEntity.badRequest().body("Reset link has expired. Please request a new one.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok("Password reset successfully. You can now login.");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helper: Generate strong unique password
    // ─────────────────────────────────────────────────────────────────────────
    private String generateSecurePassword() {
        String upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
        String lower = "abcdefghjkmnpqrstuvwxyz";
        String digits = "23456789";
        String special = "@#$%&!";
        String all = upper + lower + digits + special;

        java.security.SecureRandom rnd = new java.security.SecureRandom();
        StringBuilder sb = new StringBuilder();

        // Ensure at least one of each type
        sb.append(upper.charAt(rnd.nextInt(upper.length())));
        sb.append(lower.charAt(rnd.nextInt(lower.length())));
        sb.append(digits.charAt(rnd.nextInt(digits.length())));
        sb.append(special.charAt(rnd.nextInt(special.length())));

        // Fill remaining 4 characters
        for (int i = 4; i < 8; i++) {
            sb.append(all.charAt(rnd.nextInt(all.length())));
        }

        // Shuffle
        char[] chars = sb.toString().toCharArray();
        for (int i = chars.length - 1; i > 0; i--) {
            int j = rnd.nextInt(i + 1);
            char tmp = chars[i];
            chars[i] = chars[j];
            chars[j] = tmp;
        }
        return new String(chars);
    }
}
