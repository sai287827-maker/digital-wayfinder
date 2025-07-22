package com.example.DigitalWayfinder.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "InScopePlatforms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InScopePlatform {
    
    // @Id
    // @GeneratedValue(strategy = GenerationType.IDENTITY)
    // @Column(name = "Key")
    // private Integer key;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "FunctionalArea")
    private String functionalArea;
    
    @Column(name = "IndustryType")
    private String industryType;
    
    @Column(name = "FunctionalSubArea")
    private String functionalSubArea;
    
    @Column(name = "PlatformName")
    private String platformName;
    
    @Column(name = "PlatformImage")
    private String platformImageUrl;
}
