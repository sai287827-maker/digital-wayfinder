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
public class NonFunctionalResponse {
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
