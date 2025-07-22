package com.example.DigitalWayfinder.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SolutionSelectionRequest {
    
    // private String userId;
    // private String sessionId;
    
    // private String functionalArea;
    // private String industryType;
    // private String functionalSubArea;
    // private String key;
    
    @NotEmpty(message = "At least one platform must be selected")
    private List<String> selectedPlatforms;
}
