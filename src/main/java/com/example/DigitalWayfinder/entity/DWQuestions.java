package com.example.DigitalWayfinder.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// import java.time.LocalDateTime;

@Entity
@Table(name = "DWQuestions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DWQuestions {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "FunctionalArea")
    private String functionalArea;
    
    @Column(name = "FunctionalSubArea")
    private String functionalSubArea;
    
    @Column(name = "Category")
    private String category;
    
    @Column(name = "Question", columnDefinition = "TEXT")
    private String question;
    
    @Column(name = "ResponseType")
    private String responseType;
    
    // @Column(name = "created_at")
    // private LocalDateTime createdAt;
    
    // @Column(name = "updated_at")
    // private LocalDateTime updatedAt;
    
    // Constructor without id and timestamps
    public DWQuestions(String functionalArea, String functionalSubArea, String category, 
                          String question, String responseType) {
        this.functionalArea = functionalArea;
        this.functionalSubArea = functionalSubArea;
        this.category = category;
        this.question = question;
        this.responseType = responseType;
    }
    
    // @PrePersist
    // protected void onCreate() {
    //     createdAt = LocalDateTime.now();
    //     updatedAt = LocalDateTime.now();
    // }
    
    // @PreUpdate
    // protected void onUpdate() {
    //     updatedAt = LocalDateTime.now();
    // }
}