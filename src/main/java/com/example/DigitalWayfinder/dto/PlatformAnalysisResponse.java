package com.example.DigitalWayfinder.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PlatformAnalysisResponse {
    
    private String userId;
    private String sessionId;
    private List<PlatformAnalysisItem> reportData;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PlatformAnalysisItem {
        private String assetName;
        private String category;
        private String gaps;
    }
}