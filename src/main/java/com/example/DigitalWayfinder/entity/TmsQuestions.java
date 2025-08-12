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
@Table(name = "TMS_Questionnaire") 
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(TmsQuestions.TmsQuestionsId.class)
public class TmsQuestions {
    
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
    public static class TmsQuestionsId implements Serializable {
        private String category;
        private String question;
    }
}