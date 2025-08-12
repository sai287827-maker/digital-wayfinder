package com.example.DigitalWayfinder.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "DWQuestions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DWQuestions {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "UserID", nullable = false)
    private String userId;
    
    @Column(name = "SessionID", nullable = false)
    private String sessionId;
    
    @Column(name = "FunctionalArea", nullable = false)
    private String functionalArea;

    @Column(name = "FunctionalSubArea")
    private String functionalSubArea;
    
    @Column(name = "Category")
    private String category;
    
    @Column(name = "Question", columnDefinition = "TEXT")
    private String question;
    
    @Column(name = "ResponseType")
    private String responseType;  // This will store: low, medium, high
}