package com.example.DigitalWayfinder.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FunctionalScopeResponse {
    private String userId;
    private String sessionId;
    private String functionalArea;
    private String industryType;
    private String functionalSubArea;
    private List<LevelPath> levelSelections;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LevelPath {
        private String l1;
        private String l2;
        private String l3;
        private String l4;
        private String l5;
    }
}
