package com.example.DigitalWayfinder.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SaveAnswersRequest {
    
    @NotBlank(message = "functionalArea is required")
    private String functionalArea;
    
    @NotBlank(message = "functionalSubArea is required")
    private String functionalSubArea;
    
    @NotNull(message = "answers list is required")
    @Valid
    private List<AnswerItem> answers;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AnswerItem {
        
        @NotBlank(message = "question is required")
        private String question;
        
        @NotBlank(message = "answer is required")
        @Pattern(regexp = "^(low|medium|high|yes|no)$", message = "answer must be 'low', 'medium', 'high', 'yes', or 'no'")
        private String answer;
    }
}