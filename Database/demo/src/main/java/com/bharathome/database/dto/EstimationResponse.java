package com.bharathome.database.dto;

import com.bharathome.database.model.Estimation;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public record EstimationResponse(
    Long id,
    String userEmail,
    String type,
    String date,
    Double cost,
    String details,
    LocalDateTime createdAt
) {
    public static EstimationResponse fromEntity(Estimation estimation) {
        return new EstimationResponse(
            estimation.getId(),
            estimation.getUserEmail(),
            estimation.getType(),
            estimation.getDate(),
            estimation.getCost(),
            estimation.getDetails(),
            estimation.getCreatedAt()
        );
    }

    public static List<EstimationResponse> fromEntities(List<Estimation> estimations) {
        return estimations.stream().map(EstimationResponse::fromEntity).collect(Collectors.toList());
    }
}
