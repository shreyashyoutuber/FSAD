package com.bharathome.database.controller;

import com.bharathome.database.model.Estimation;
import com.bharathome.database.model.User;
import com.bharathome.database.repository.EstimationRepository;
import com.bharathome.database.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/estimations")
public class EstimationController {

    private final EstimationRepository estimationRepository;
    private final UserRepository userRepository;

    public EstimationController(EstimationRepository estimationRepository, UserRepository userRepository) {
        this.estimationRepository = estimationRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/{userEmail}")
    public List<Estimation> getEstimations(@PathVariable String userEmail) {
        return estimationRepository.findByUser_Email(userEmail);
    }

    @PostMapping
    public Estimation saveEstimation(@RequestBody Estimation estimation) {
        // Since we removed userEmail from Estimation table, we must find the user
        String email = estimation.getUserEmail();
        if (email == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userEmail is required");
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        
        estimation.setUser(user);
        return estimationRepository.save(estimation);
    }
}
