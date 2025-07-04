package com.example.DigitalWayfinder.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubFunctionalAreaResponseDTO {
    private Long id;
    private String userId;
    private String sessionId;
    private String functionalArea;
    private String industryType;
    private String message;
    private String functionalSubArea;
}