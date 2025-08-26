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
    private String functionalArea;
    private String industryType;
    private String functionalSubArea;
    private FunctionalData functional;
    private NonFunctionalData nonFunctional;
    private List<Criteria> criteria;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FunctionalData {
        private List<LevelSelection> levelSelections;  // Raw array format
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NonFunctionalData {
        private List<LevelSelection> levelSelections;  // Raw array format
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LevelSelection {
        private String l1;
        private String l2;
        private String l3;
        private String l4;
        private String l5;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Criteria {
        private String id;
        private String label;
        private boolean inScope;
    }
}