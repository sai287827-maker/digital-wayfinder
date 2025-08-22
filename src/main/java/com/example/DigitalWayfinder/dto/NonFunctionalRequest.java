package com.example.DigitalWayfinder.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NonFunctionalRequest {
    
    private String userId;
    private String sessionId;
    private String functionalArea;
    private String industryType;
    private String functionalSubArea;
    
    @Valid
    private LevelSelections levelSelections;
    
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
