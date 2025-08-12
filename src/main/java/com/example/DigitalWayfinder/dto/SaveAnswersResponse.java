package com.example.DigitalWayfinder.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import com.fasterxml.jackson.annotation.JsonInclude;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SaveAnswersResponse {
    
    private String userId;
    private String sessionId;
    private String functionalArea;
    private String functionalSubArea;
    private String category;
    private Integer savedCount;
    private String message;
}