package com.example.DigitalWayfinder.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name = "WMS_Questionnaire")  // Changed to match your actual table name
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(WmsQuestions.WmsQuestionsId.class)
public class WmsQuestions {
    
    @Id
    @Column(name = "category")
    private String category;
    
    @Id
    @Column(name = "question", columnDefinition = "TEXT")
    private String question;
    
    // Composite key class
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WmsQuestionsId implements Serializable {
        private String category;
        private String question;
    }
}