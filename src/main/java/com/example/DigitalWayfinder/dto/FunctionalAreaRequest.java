package com.example.DigitalWayfinder.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FunctionalAreaRequest {
    
    @NotBlank(message = "Functional area is required")
    private String functionalArea;
    
    // private String industryType;
    
    // private String functionalSubArea;
    
    // Note: userId and sessionId will be extracted from authentication context
}