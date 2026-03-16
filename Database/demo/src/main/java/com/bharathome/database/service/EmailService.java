package com.bharathome.database.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

  private final RestTemplate restTemplate;

  @Value("${app.frontend.url}")
  private String frontendUrl;

  @Value("${app.brevo.api-key}")
  private String brevoApiKey;

  private final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

  public EmailService(RestTemplate restTemplate) {
    this.restTemplate = restTemplate;
  }

  private void sendEmailViaBrevo(String toEmail, String subject, String htmlContent) throws Exception {
    if (brevoApiKey == null || brevoApiKey.isBlank()) {
      System.err.println("CRITICAL CONFIG ERROR: BREVO_API_KEY is null or empty!");
    } else {
      String trimmedKey = brevoApiKey.trim();
      System.out.println("BREVO_API_KEY Check: Length=" + trimmedKey.length() + ", StartsWith="
          + (trimmedKey.length() > 10 ? trimmedKey.substring(0, 7) : "too short"));
    }

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.setAccept(java.util.Collections.singletonList(MediaType.APPLICATION_JSON));
    headers.set("api-key", brevoApiKey != null ? brevoApiKey.trim() : "");

    Map<String, Object> body = new HashMap<>();
    body.put("sender", Map.of("name", "BharthomeValue", "email", "bharthomevalue@gmail.com"));
    body.put("to", List.of(Map.of("email", toEmail)));
    body.put("subject", subject);
    body.put("htmlContent", htmlContent);
    body.put("textContent", "Please use an HTML compatible email client to view this message.");

    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

    try {
      System.out.println("Attempting to send email to: " + toEmail + " via Brevo...");
      ResponseEntity<String> response = restTemplate.postForEntity(BREVO_API_URL, entity, String.class);
      System.out.println("Brevo Response Status: " + response.getStatusCode());
      System.out.println("Brevo Response Body: " + response.getBody());

      if (!response.getStatusCode().is2xxSuccessful()) {
        throw new Exception("Brevo API error: " + response.getStatusCode() + " - " + response.getBody());
      }
    } catch (Exception e) {
      System.err.println("CRITICAL: Failed to send email via Brevo: " + e.getMessage());
      e.printStackTrace();
      throw e;
    }
  }

  public void sendOtpEmail(String toEmail, String name, String otp) throws Exception {
    String subject = "Your OTP - BharatHome Value";
    String html = """
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #eeeeee;border-radius:12px;overflow:hidden;">
          <div style="background-color:#1a1a2e;padding:30px 40px;text-align:center;">
            <h1 style="color:#c9a84c;margin:0;font-size:24px;letter-spacing:1px;">BharatHome<span style="color:#ffffff;">Value</span></h1>
          </div>
          <div style="padding:40px;text-align:center;">
            <p style="color:#2d3748;font-size:16px;margin:0 0 10px;">Hello %s,</p>
            <p style="color:#4a5568;font-size:15px;margin:0 0 30px;">Use the OTP below to verify your email address. It expires in 5 minutes.</p>
            <div style="background-color:#f7f8fa;border:2px dashed #c9a84c;border-radius:10px;padding:30px;margin-bottom:20px;">
              <span style="font-size:42px;font-weight:800;color:#1a1a2e;letter-spacing:10px;">%s</span>
            </div>
          </div>
          <div style="background-color:#f7f8fa;padding:20px;text-align:center;border-top:1px solid #eeeeee;">
            <p style="color:#a0aec0;font-size:12px;margin:0;">&copy; 2025 BharatHome Value. All rights reserved.</p>
          </div>
        </div>
        """
        .formatted(name, otp);

    sendEmailViaBrevo(toEmail, subject, html);
  }

  public void sendWelcomeEmail(String toEmail, String name, String defaultPassword) throws Exception {
    String subject = "Welcome to BharatHome Value - Your Account Details";
    String resetLink = frontendUrl + "/reset-password";

    String html = """
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #eeeeee;border-radius:12px;overflow:hidden;">
          <div style="background-color:#1a1a2e;padding:30px 40px;text-align:center;">
            <h1 style="color:#c9a84c;margin:0;font-size:24px;letter-spacing:1px;">BharatHome<span style="color:#ffffff;">Value</span></h1>
          </div>
          <div style="padding:40px;">
            <p style="color:#2d3748;font-size:18px;font-weight:600;margin:0 0 10px;">Welcome, %s! 🎉</p>
            <p style="color:#4a5568;font-size:15px;margin:0 0 20px;">Your account is ready. Here are your login details:</p>

            <div style="background-color:#f7f8fa;border-left:4px solid #c9a84c;padding:20px;margin-bottom:30px;">
              <p style="margin:0 0 10px;"><strong>Email:</strong> %s</p>
              <p style="margin:0;"><strong>Default Password:</strong> <span style="font-family:monospace;font-size:18px;letter-spacing:2px;">%s</span></p>
            </div>

            <div style="text-align:center;margin-bottom:20px;">
              <a href="%s" style="display:inline-block;background-color:#c9a84c;color:#1a1a2e;text-decoration:none;padding:15px 30px;border-radius:8px;font-size:16px;font-weight:700;">Reset My Password</a>
            </div>
            <p style="color:#718096;font-size:13px;text-align:center;">If the button doesn't work, copy this link:<br/>%s</p>
          </div>
          <div style="background-color:#f7f8fa;padding:20px;text-align:center;border-top:1px solid #eeeeee;">
            <p style="color:#a0aec0;font-size:12px;margin:0;">&copy; 2025 BharatHome Value. All rights reserved.</p>
          </div>
        </div>
        """
        .formatted(name, toEmail, defaultPassword, resetLink, resetLink);

    sendEmailViaBrevo(toEmail, subject, html);
  }

  public void sendPasswordResetEmail(String toEmail, String name, String resetToken) throws Exception {
    String subject = "Reset Your Password - BharatHome Value";
    String resetLink = frontendUrl + "/reset-password?token=" + resetToken;

    String html = """
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #eeeeee;border-radius:12px;overflow:hidden;">
          <div style="background-color:#1a1a2e;padding:30px 40px;text-align:center;">
            <h1 style="color:#c9a84c;margin:0;font-size:24px;letter-spacing:1px;">BharatHome<span style="color:#ffffff;">Value</span></h1>
          </div>
          <div style="padding:40px;">
            <p style="color:#2d3748;font-size:16px;margin:0 0 10px;">Hello %s,</p>
            <p style="color:#4a5568;font-size:15px;margin:0 0 25px;">We received a request to reset your password. Click the button below. This link expires in 1 hour.</p>
            <div style="text-align:center;margin-bottom:20px;">
              <a href="%s" style="display:inline-block;background-color:#c9a84c;color:#1a1a2e;text-decoration:none;padding:15px 30px;border-radius:8px;font-size:16px;font-weight:700;">Reset My Password</a>
            </div>
            <p style="color:#718096;font-size:13px;text-align:center;">If the button doesn't work, copy this link:<br/>%s</p>
          </div>
          <div style="background-color:#f7f8fa;padding:20px;text-align:center;border-top:1px solid #eeeeee;">
            <p style="color:#a0aec0;font-size:12px;margin:0;">&copy; 2025 BharatHome Value. All rights reserved.</p>
          </div>
        </div>
        """
        .formatted(name, resetLink, resetLink);

    sendEmailViaBrevo(toEmail, subject, html);
  }
}
