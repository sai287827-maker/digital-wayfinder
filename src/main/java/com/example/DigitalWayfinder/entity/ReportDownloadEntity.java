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
@Table(name = "vw_Fnl_FunctionScore_WMS") // Replace with your actual table name
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportDownloadEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "Assert Name")
    private String assetName;
    
    @Column(name = "Category")
    private String category;
    
    @Column(name = "Gaps")
    private String gaps;
    
    @Column(name = "L2")
    private String l2;
}