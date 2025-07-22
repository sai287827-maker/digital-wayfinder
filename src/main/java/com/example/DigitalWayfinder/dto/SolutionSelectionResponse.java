package com.example.DigitalWayfinder.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SolutionSelectionResponse {
    // private Long id;
    private String message;
    private int platformsSaved;
    
    public static SolutionSelectionResponse success(String message, int platformsSaved) {
        return SolutionSelectionResponse.builder()
                .message(message)
                .platformsSaved(platformsSaved)
                .build();
    }
}
