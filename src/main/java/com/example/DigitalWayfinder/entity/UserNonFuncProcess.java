package com.example.DigitalWayfinder.entity;

import jakarta.persistence.*;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "UserNonFuncProcess")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserNonFuncProcess {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "UserID", nullable = false)
    private String userId;
    
    @Column(name = "SessionID", nullable = false)
    private String sessionId;
    
    @Column(name = "FunctionalArea")
    private String functionalArea;
    
    @Column(name = "IndustryType")
    private String industryType;
    
    @Column(name = "FunctionalSubArea")
    private String functionalSubArea;
    
    @Column(name = "L1", columnDefinition = "TEXT")
    private String l1;
    
    @Column(name = "L2", columnDefinition = "TEXT")
    private String l2;
    
    @Column(name = "L3", columnDefinition = "TEXT")
    private String l3;
    
    @Column(name = "L4", columnDefinition = "TEXT")
    private String l4;
    
    @Column(name = "L5", columnDefinition = "TEXT")
    private String l5;

    @Column(name = "CreatedDate")
    private LocalDateTime createdDate;

    @PrePersist
    protected void onCreate() {
        if (createdDate == null) {
            createdDate = LocalDateTime.now();
        }
    }
}
