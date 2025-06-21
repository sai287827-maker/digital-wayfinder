package com.example.DigitalWayfinder.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "ProjectType")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectType {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "UserID", length = 100)
    private String userID;
    
    @Column(name = "ProjectType", length = 50)
    private String projectType;
    
    @Column(name = "RequestID", length = 100)
    private String requestID;
    
    @Column(name = "ClientName", length = 200)
    private String clientName;
    
    @Column(name = "ClientDescription", columnDefinition = "NVARCHAR(MAX)")
    private String clientDescription;
    
    @Column(name = "ProjectScope", columnDefinition = "NVARCHAR(MAX)")
    private String projectScope;
    
    @Column(name = "CreatedDate")
    private LocalDateTime createdDate;
    
    @Column(name = "SessionID", length = 100)
    private String sessionID;
    
    // Custom constructor without ID (for creation)
    public ProjectType(String userID, String projectType, String requestID, 
                      String clientName, String clientDescription, 
                      String projectScope, String sessionID) {
        this.userID = userID;
        this.projectType = projectType;
        this.requestID = requestID;
        this.clientName = clientName;
        this.clientDescription = clientDescription;
        this.projectScope = projectScope;
        this.sessionID = sessionID;
        this.createdDate = LocalDateTime.now();
    }
    
    @PrePersist
    protected void onCreate() {
        if (createdDate == null) {
            createdDate = LocalDateTime.now();
        }
    }
}