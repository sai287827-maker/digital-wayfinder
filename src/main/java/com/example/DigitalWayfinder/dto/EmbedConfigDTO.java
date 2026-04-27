package com.example.DigitalWayfinder.dto;

public class EmbedConfigDTO {
    private String embedUrl;
    private String embedToken;
    private String reportId;

    public EmbedConfigDTO(String embedUrl, String embedToken, String reportId) {
        this.embedUrl = embedUrl;
        this.embedToken = embedToken;
        this.reportId = reportId;
    }

    public String getEmbedUrl() {
        return embedUrl;
    }

    public String getEmbedToken() {
        return embedToken;
    }

    public String getReportId() {
        return reportId;
    }
}