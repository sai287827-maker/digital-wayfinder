package com.example.DigitalWayfinder.controller;

import com.example.DigitalWayfinder.dto.EmbedConfigDTO;
import com.example.DigitalWayfinder.service.PowerBIService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/powerbi")
public class PowerBIController {

    @Autowired
    private PowerBIService powerBIService;

    @GetMapping("/embed-config")
    public EmbedConfigDTO getEmbedConfig(@RequestParam String reportId) throws Exception {
        return powerBIService.getEmbedConfig(reportId);
    }
}