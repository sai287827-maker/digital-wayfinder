package com.example.DigitalWayfinder.dto;

import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSession {
    private String userId;
    private String sessionId;
    private HttpSession httpSession;

    @Override
    public String toString() {
        return "UserSession{" +
                "userId='" + userId + '\'' +
                ", sessionId='" + sessionId + '\'' +
                '}';
    }
}
