package com.example.DigitalWayfinder.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FunctionalAreaResponse {
    private Long id;
    private String userId;
    private String sessionId;
    private String functionalArea;
    private String industryType;
    private String functionalSubArea;
    private String message;
    private boolean success;
}