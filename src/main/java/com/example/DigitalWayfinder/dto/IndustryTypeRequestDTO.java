package com.example.DigitalWayfinder.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IndustryTypeRequestDTO {

    @NotBlank(message = "IndustryType is required")
    private String industryType;
}
