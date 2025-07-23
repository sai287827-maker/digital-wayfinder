package com.example.DigitalWayfinder.entity;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
// import javax.persistence.*;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

// import java.time.LocalDateTime;

@Entity
@Table(name = "UserPlatform")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Slf4j
@IdClass(UserPlatformId.class)
public class UserPlatform {
    
    @Id
    // @GeneratedValue(strategy = GenerationType.IDENTITY)
    // private Long id;
    
    @Column(name = "UserID", nullable = false)
    private String userId;
    
    @Id
    @Column(name = "SessionID", nullable = false)
    private String sessionId;
    
    @Column(name = "FunctionalArea")
    private String functionalArea;
    
    @Column(name = "IndustryType")
    private String industryType;
    
    @Column(name = "FunctionalSubArea")
    private String functionalSubArea;
    
    @Id
    @Column(name = "Platform", nullable = false)
    private String platform;
    
    // @Column(name = "Key")
    // private String key;
    
    // @Column(name = "CreatedAt")
    // private LocalDateTime createdAt;
    
    // @PrePersist
    // protected void onCreate() {
    //     createdAt = LocalDateTime.now();
    //     log.debug("Creating new UserPlatform entity for user: {} session: {}", userId, sessionId);
    // }
}