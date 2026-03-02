package com.bharathome.database.repository;

import com.bharathome.database.model.Estimation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EstimationRepository extends JpaRepository<Estimation, Long> {
    List<Estimation> findByUserEmail(String userEmail);
}
