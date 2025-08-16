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

@Entity
@Table(name = "vw_Fnl_FunctionScore_WMS")  // Changed to match your actual table name
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlatformAnalysis {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "Asset Name")
    private String assetName;

    @Column(name = "Category", columnDefinition = "TEXT")
    private String category;

    @Column(name = "Gaps", columnDefinition = "TEXT")
    private String gaps;

    @Column(name = "Session ID")
    private String sessionId;

    @Column(name = "User ID")
    private String userId;
}