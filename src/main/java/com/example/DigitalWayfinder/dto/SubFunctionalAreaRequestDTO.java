package com.example.DigitalWayfinder.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubFunctionalAreaRequestDTO {

    @NotBlank(message = "Functional Sub-Area is required")
    private String functionalSubArea;
}
