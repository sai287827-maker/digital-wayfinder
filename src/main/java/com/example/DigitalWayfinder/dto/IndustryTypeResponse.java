package com.example.DigitalWayfinder.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IndustryTypeResponse {
    private String userId;
    private String sessionId;
    private String industryType;
    private String message;
}