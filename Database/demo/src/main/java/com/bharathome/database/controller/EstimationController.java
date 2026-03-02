package com.bharathome.database.controller;

import com.bharathome.database.model.Estimation;
import com.bharathome.database.repository.EstimationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estimations")
@CrossOrigin(origins = {"http://localhost:5173", "https://bharathomevalue.vercel.app", "https://bharathome.vercel.app"})
public class EstimationController {

    private final EstimationRepository estimationRepository;

    public EstimationController(EstimationRepository estimationRepository) {
        this.estimationRepository = estimationRepository;
    }

    @GetMapping("/{userEmail}")
    public List<Estimation> getEstimations(@PathVariable String userEmail) {
        return estimationRepository.findByUserEmail(userEmail);
    }

    @PostMapping
    public Estimation saveEstimation(@RequestBody Estimation estimation) {
        return estimationRepository.save(estimation);
    }
}
