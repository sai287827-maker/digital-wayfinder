package com.example.DigitalWayfinder.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPlatformId implements Serializable {
    private String userId;
    private String sessionId;
    private String platform;
}
