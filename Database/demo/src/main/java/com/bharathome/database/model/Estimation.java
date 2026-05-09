package com.bharathome.database.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "estimations")
public class Estimation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Transient
    private String userEmail; 
    @NotBlank(message = "Estimation type is required")
    private String type; // e.g., "Kitchen Estimator"
    
    @NotBlank(message = "Date is required")
    private String date;
    
    @NotNull(message = "Cost is required")
    @DecimalMin(value = "0.0", message = "Cost cannot be negative")
    private Double cost;
    
    @NotBlank(message = "Details are required")
    @Column(columnDefinition = "LONGTEXT")
    private String details; // Stores the JSON details of the estimate

    // --- Admin Response Fields ---
    private Double adminQuote;
    
    @Column(columnDefinition = "LONGTEXT")
    private String adminDescription;
    
    private String adminTimeline;
    private String adminWarranty;
    
    @Column(columnDefinition = "LONGTEXT")
    private String adminNotes;
    
    private Boolean responded = false;
    private String status = "PENDING"; // PENDING, RESPONDED, IN_PROGRESS, COMPLETED

    private LocalDateTime createdAt = LocalDateTime.now();

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    @JsonProperty("userEmail")
    public String getUserEmail() {
        if (user != null) return user.getEmail();
        return this.userEmail;
    }

    @JsonProperty("userEmail")
    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public Double getCost() { return cost; }
    public void setCost(Double cost) { this.cost = cost; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public Double getAdminQuote() { return adminQuote; }
    public void setAdminQuote(Double adminQuote) { this.adminQuote = adminQuote; }
    public String getAdminDescription() { return adminDescription; }
    public void setAdminDescription(String adminDescription) { this.adminDescription = adminDescription; }
    public String getAdminTimeline() { return adminTimeline; }
    public void setAdminTimeline(String adminTimeline) { this.adminTimeline = adminTimeline; }
    public String getAdminWarranty() { return adminWarranty; }
    public void setAdminWarranty(String adminWarranty) { this.adminWarranty = adminWarranty; }
    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
    public Boolean getResponded() { return responded; }
    public void setResponded(Boolean responded) { this.responded = responded; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
