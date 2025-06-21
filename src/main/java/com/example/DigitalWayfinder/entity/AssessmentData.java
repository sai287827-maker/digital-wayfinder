package com.example.DigitalWayfinder.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "fulfillment_oms")
public class AssessmentData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "l1")
    private String l1;
    
    @Column(name = "l2")
    private String l2;
    
    @Column(name = "asset_type")
    private String assetType;
    
    @Column(name = "asset_name")
    private String assetName;
    
    @Column(name = "asset_reference")
    private String assetReference;
    
    // Constructors
    public AssessmentData() {}
    
    public AssessmentData(String l1, String l2, String assetType, String assetName, String assetReference) {
        this.l1 = l1;
        this.l2 = l2;
        this.assetType = assetType;
        this.assetName = assetName;
        this.assetReference = assetReference;
    }
    
    //Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getL1() { return l1; }
    public void setL1(String l1) { this.l1 = l1; }
    
    public String getL2() { return l2; }
    public void setL2(String l2) { this.l2 = l2; }
    
    public String getAssetType() { return assetType; }
    public void setAssetType(String assetType) { this.assetType = assetType; }
    
    public String getAssetName() { return assetName; }
    public void setAssetName(String assetName) { this.assetName = assetName; }
    
    public String getAssetReference() { return assetReference; }
    public void setAssetReference(String assetReference) { this.assetReference = assetReference; }
}