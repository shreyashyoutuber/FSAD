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
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">
          <div style="background:linear-gradient(135deg,#1a1a2e 0%%,#16213e 100%%);padding:36px 40px 28px;">
            <h1 style="color:#c9a84c;margin:0;font-size:26px;letter-spacing:1px;">BharatHome<span style="color:#ffffff;">Value</span></h1>
            <p style="color:#a0aec0;margin:8px 0 0;font-size:13px;">Property Value Intelligence</p>
          </div>
          <div style="padding:36px 40px;">
            <p style="color:#2d3748;font-size:16px;margin:0 0 8px;">Hello <strong>%s</strong>,</p>
            <p style="color:#4a5568;font-size:15px;margin:0 0 28px;">Use the OTP below to verify your email address. It expires in <strong>5 minutes</strong>.</p>
            <div style="background:#f7f8fa;border:2px dashed #c9a84c;border-radius:10px;padding:24px;text-align:center;margin-bottom:28px;">
              <p style="color:#718096;font-size:13px;margin:0 0 8px;text-transform:uppercase;letter-spacing:2px;">Your OTP Code</p>
              <span style="font-size:42px;font-weight:800;color:#1a1a2e;letter-spacing:10px;">%s</span>
            </div>
            <p style="color:#718096;font-size:13px;margin:0;">If you did not request this, please ignore this email.</p>
          </div>
          <div style="background:#f7f8fa;padding:18px 40px;text-align:center;border-top:1px solid #e2e8f0;">
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
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">
          <div style="background:linear-gradient(135deg,#1a1a2e 0%%,#16213e 100%%);padding:36px 40px 28px;">
            <h1 style="color:#c9a84c;margin:0;font-size:26px;letter-spacing:1px;">BharatHome<span style="color:#ffffff;">Value</span></h1>
            <p style="color:#a0aec0;margin:8px 0 0;font-size:13px;">Property Value Intelligence</p>
          </div>
          <div style="padding:36px 40px;">
            <p style="color:#2d3748;font-size:18px;font-weight:600;margin:0 0 8px;">Welcome, %s! 🎉</p>
            <p style="color:#4a5568;font-size:15px;margin:0 0 24px;">Your account has been successfully created. Here are your login details:</p>

            <div style="background:#f7f8fa;border-left:4px solid #c9a84c;border-radius:6px;padding:20px 24px;margin-bottom:24px;">
              <p style="color:#718096;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">Email</p>
              <p style="color:#1a1a2e;font-size:15px;font-weight:600;margin:0 0 16px;">%s</p>
              <p style="color:#718096;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">Default Password</p>
              <p style="color:#1a1a2e;font-size:18px;font-weight:800;letter-spacing:3px;margin:0;font-family:monospace;">%s</p>
            </div>

            <p style="color:#e53e3e;font-size:13px;margin:0 0 24px;">⚠️ For your security, we strongly recommend resetting this password immediately.</p>

            <div style="text-align:center;">
              <a href="%s" style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#a07830);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:15px;font-weight:600;letter-spacing:0.5px;">Reset My Password</a>
            </div>
          </div>
          <div style="background:#f7f8fa;padding:18px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="color:#a0aec0;font-size:12px;margin:0;">&copy; 2025 BharatHome Value. All rights reserved.</p>
          </div>
        </div>
        """
        .formatted(name, toEmail, defaultPassword, resetLink);

    sendEmailViaBrevo(toEmail, subject, html);
  }

  public void sendPasswordResetEmail(String toEmail, String name, String resetToken) throws Exception {
    String subject = "Reset Your Password - BharatHome Value";
    String resetLink = frontendUrl + "/reset-password?token=" + resetToken;

    String html = """
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">
          <div style="background:linear-gradient(135deg,#1a1a2e 0%%,#16213e 100%%);padding:36px 40px 28px;">
            <h1 style="color:#c9a84c;margin:0;font-size:26px;letter-spacing:1px;">BharatHome<span style="color:#ffffff;">Value</span></h1>
            <p style="color:#a0aec0;margin:8px 0 0;font-size:13px;">Property Value Intelligence</p>
          </div>
          <div style="padding:36px 40px;">
            <p style="color:#2d3748;font-size:16px;margin:0 0 8px;">Hello <strong>%s</strong>,</p>
            <p style="color:#4a5568;font-size:15px;margin:0 0 28px;">We received a request to reset your password. Click the button below. This link expires in <strong>1 hour</strong>.</p>
            <div style="text-align:center;margin-bottom:28px;">
              <a href="%s" style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#a07830);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:15px;font-weight:600;">Reset My Password</a>
            </div>
            <p style="color:#718096;font-size:13px;margin:0;">If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
          </div>
          <div style="background:#f7f8fa;padding:18px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="color:#a0aec0;font-size:12px;margin:0;">&copy; 2025 BharatHome Value. All rights reserved.</p>
          </div>
        </div>
        """
        .formatted(name, resetLink);

    sendEmailViaBrevo(toEmail, subject, html);
  }
}
