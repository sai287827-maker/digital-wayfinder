package com.example.DigitalWayfinder.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IndustryTypeResponseDTO {
    private Long id;
    private String userId;
    private String sessionId;
    private String functionalArea;
    private String industryType;
    private String message;
}