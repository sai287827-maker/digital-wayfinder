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
public class DecisionCriteriaResponse {
    private String userId;
    private String sessionId;
    private FunctionalData functional;
    private NonFunctionalData nonFunctional;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FunctionalData {
        private String functionalArea;
        private String industryType;
        private String functionalSubArea;
        private LevelSelections levelSelections;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NonFunctionalData {
        private String functionalArea;
        private String industryType;
        private String functionalSubArea;
        private LevelSelections levelSelections;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LevelSelections {
        private List<String> l1;
        private List<String> l2;
        private List<String> l3;
        private List<String> l4;
        private List<String> l5;
    }
}

