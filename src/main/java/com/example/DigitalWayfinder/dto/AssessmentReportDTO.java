package com.example.DigitalWayfinder.dto;

public class AssessmentReportDTO {
private String l1;
    private String l2;
    private String assetType;
    private String assetName;
    private String assetReference;
    
    // Constructors
    public AssessmentReportDTO() {}
    
    public AssessmentReportDTO(String l1, String l2, String assetType, String assetName, String assetReference) {
        this.l1 = l1;
        this.l2 = l2;
        this.assetType = assetType;
        this.assetName = assetName;
        this.assetReference = assetReference;
    }
    
    // Getters and Setters
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
