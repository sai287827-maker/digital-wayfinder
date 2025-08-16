package com.example.DigitalWayfinder.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.DigitalWayfinder.dto.PlatformAnalysisResponse;
import com.example.DigitalWayfinder.dto.UserSession;
import com.example.DigitalWayfinder.service.PlatformAnalysisService;

@RestController
@RequestMapping("api/digital-wayfinder/questionnaire")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class PlatformAnalysisController {
    
    private final PlatformAnalysisService platformAnalysisService;
    
    @GetMapping("/report")
    public ResponseEntity<PlatformAnalysisResponse> getAllPlatformAnalysis(
            @ModelAttribute UserSession userSession) {
        
        log.info("Received request to fetch all platform analysis records - user: {}, session: {}", 
                userSession.getUserId(), userSession.getSessionId());
        
        try {
            PlatformAnalysisResponse response = platformAnalysisService.getAllPlatformAnalysis(
                    userSession.getUserId(), 
                    userSession.getSessionId()
            );
            
            // Calculate total number of assets across all categories
            int totalAssets = response.getCategories().stream()
                    .mapToInt(category -> category.getAssets().size())
                    .sum();
            
            log.info("Successfully returning {} platform analysis records across {} categories", 
                    totalAssets, response.getCategories().size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error fetching platform analysis records", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/get-by-category")
    public ResponseEntity<PlatformAnalysisResponse> getPlatformAnalysisByCategory(
            @RequestParam String category,
            @ModelAttribute UserSession userSession) {
        
        log.info("Received request to fetch platform analysis for category: {} - user: {}, session: {}", 
                category, userSession.getUserId(), userSession.getSessionId());
        
        try {
            PlatformAnalysisResponse response = platformAnalysisService.getPlatformAnalysisByCategory(
                    category,
                    userSession.getUserId(), 
                    userSession.getSessionId()
            );
            
            // Calculate total number of assets across all categories
            int totalAssets = response.getCategories().stream()
                    .mapToInt(categoryItem -> categoryItem.getAssets().size())
                    .sum();
            
            log.info("Successfully returning {} records for category: {} across {} categories", 
                    totalAssets, category, response.getCategories().size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error fetching platform analysis records for category: {}", category, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}