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
@Table(name = "vw_Fnl_FunctionScore_WMS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportDownloadEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
    
    @Column(name = "Asset Name")  // Fixed: was "Assert Name"
    private String assetName;
    
    @Column(name = "Category")
    private String category;
    
    @Column(name = "Gaps")
    private String gaps;

    @Column(name = "SessionID")
    private String sessionID;

    @Column(name = "UserID")
    private String userID;
    
    @Column(name = "L2")
    private String l2;
}