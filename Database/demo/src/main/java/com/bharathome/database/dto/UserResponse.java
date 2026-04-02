package com.bharathome.database.dto;

import com.bharathome.database.model.User;
import java.util.List;
import java.util.stream.Collectors;

public record UserResponse(
    Long id,
    String name,
    String email,
    String phone,
    String token
) {
    public static UserResponse fromEntity(User user) {
        return new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getPhone(),
            null
        );
    }

    public static List<UserResponse> fromEntities(List<User> users) {
        return users.stream().map(UserResponse::fromEntity).collect(Collectors.toList());
    }
}
