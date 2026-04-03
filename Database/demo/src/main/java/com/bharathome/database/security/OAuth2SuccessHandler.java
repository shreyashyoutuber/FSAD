package com.bharathome.database.security;

import com.bharathome.database.model.User;
import com.bharathome.database.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public OAuth2SuccessHandler(JwtUtils jwtUtils, UserRepository userRepository) {
        this.jwtUtils = jwtUtils;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");

        if (email == null) {
            response.sendRedirect(frontendUrl + "/login?error=Email not provided by Google");
            return;
        }

        // Check if user exists, if not create one
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name != null ? name : "Google User");
            // Set dummy but valid fields to satisfy database @NotBlank/Size constraints
            newUser.setPhone("0000000000"); 
            newUser.setPassword("GOOGLE_LOGIN_SECURE_BYPASS_" + System.currentTimeMillis()); 
            userRepository.save(newUser);
        }

        // Generate JWT
        String token = jwtUtils.generateToken(email);

        // Redirect to frontend with token as a parameter
        // Frontend will catch this and store it in localStorage
        response.sendRedirect(frontendUrl + "/auth-success?token=" + token + "&email=" + email);
    }
}
