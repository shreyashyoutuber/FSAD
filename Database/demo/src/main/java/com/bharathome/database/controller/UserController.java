package com.bharathome.database.controller;

import com.bharathome.database.dto.UserResponse;
import com.bharathome.database.model.User;
import com.bharathome.database.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Principal principal) {
        if (principal == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return ResponseEntity.ok(UserResponse.fromEntity(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(Principal principal, @Valid @RequestBody User updatedData) {
        if (principal == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        
        user.setName(updatedData.getName());
        user.setPhone(updatedData.getPhone());
        
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(UserResponse.fromEntity(savedUser));
    }
}
