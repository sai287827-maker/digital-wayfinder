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
public class GetAnswersResponse {
    
    private String userId;
    private String sessionId;
    private String functionalSubArea;
    private String category;
    private int answersCount;
    private List<AnswerItem> answers;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AnswerItem {
        private String question;
        private String answer;  // The user's saved response (low, medium, high)
    }
}