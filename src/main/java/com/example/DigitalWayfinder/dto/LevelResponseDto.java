package com.example.DigitalWayfinder.dto;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LevelResponseDto {
    private String value;
    private String displayName;
}
