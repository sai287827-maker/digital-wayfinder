package com.example.DigitalWayfinder.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectInfoRequest {
    
    @NotBlank(message = "Project type is required")
    @Size(max = 50, message = "Project type must not exceed 50 characters")
    private String projectType;
    
    @NotBlank(message = "Request ID is required")
    @Size(max = 100, message = "Request ID must not exceed 100 characters")
    private String requestID;
    
    @NotBlank(message = "Client name is required")
    @Size(max = 200, message = "Client name must not exceed 200 characters")
    private String clientName;
    
    @Size(max = 4000, message = "Client description is too long")
    private String clientDescription;
    
    @Size(max = 4000, message = "Project scope is too long")
    private String projectScope;
}
