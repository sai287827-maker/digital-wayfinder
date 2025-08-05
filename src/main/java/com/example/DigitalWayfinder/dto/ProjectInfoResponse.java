package com.example.DigitalWayfinder.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectInfoResponse {
    
    private Long id;
    private String userID;
    private String projectType;
    private String requestID;
    private String clientName;
    private String clientDescription;
    private String projectScope;
    private LocalDateTime createdDate;
    private String sessionID;
    private String message;
    private boolean success;
    private boolean updated; // Add this field

    
    // Constructor for simple success/error responses
    public ProjectInfoResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    public static ProjectInfoResponse error(String message) {
        return new ProjectInfoResponse(false, message);
    }

    public static ProjectInfoResponse builder() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'builder'");
    }

    public Object requestID(String requestID2) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'requestID'");
    }

    public static ProjectInfoResponse success(String message) {
        return new ProjectInfoResponse(true, message);
    }
}