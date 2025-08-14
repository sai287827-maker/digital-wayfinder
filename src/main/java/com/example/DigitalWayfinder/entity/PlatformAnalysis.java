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
@Table(name = "vw_Fnl_FunctionScore_WMS")  // Changed to match your actual table name
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(PlatformAnalysis.PlatformAnalysisId.class)
public class PlatformAnalysis {
    
    @Id
    @Column(name = "Asset Name")
    private String assetName;

    @Id
    @Column(name = "Category", columnDefinition = "TEXT")
    private String category;

    @Id
    @Column(name = "Gaps", columnDefinition = "TEXT")
    private String gaps;
    
    // Composite key class
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlatformAnalysisId implements Serializable {
        private String assetName;
        private String category;
        private String gaps;
    }
}