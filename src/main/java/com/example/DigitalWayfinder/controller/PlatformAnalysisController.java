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
    
    // Industry Type constants
    private static final String INDUSTRY_AGNOSTIC = "Industry Agnostic";
    private static final String RETAIL_INDUSTRY = "Retail Industry Specific";
    private static final String CONSUMER_GOODS_INDUSTRY = "Consumer Goods Industry Specific";
    
    @GetMapping("/report")
    public ResponseEntity<PlatformAnalysisResponse> getAllPlatformAnalysis(
            @ModelAttribute UserSession userSession,
            @RequestParam(required = false) String functionalSubArea,
            @RequestParam(required = false) String industryType) {
        
        log.info("Received request to fetch all platform analysis records - user: {}, session: {}, functionalSubArea: {}, industryType: {}", 
                userSession.getUserId(), userSession.getSessionId(), functionalSubArea, industryType);
        
        try {
            // Determine system type based on UI parameters
            String systemType = determineSystemType(functionalSubArea, industryType);
            log.info("Determined system type: {} for user: {}, session: {}", systemType, userSession.getUserId(), userSession.getSessionId());
            
            PlatformAnalysisResponse response = platformAnalysisService.getAllPlatformAnalysis(
                    userSession.getUserId(), 
                    userSession.getSessionId(),
                    systemType
            );
            
            // Calculate total number of assets across all categories
            int totalAssets = response.getCategories().stream()
                    .mapToInt(category -> category.getAssets().size())
                    .sum();
            
            log.info("Successfully returning {} platform analysis records across {} categories using {} system", 
                    totalAssets, response.getCategories().size(), systemType);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error fetching platform analysis records", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/get-by-category")
    public ResponseEntity<PlatformAnalysisResponse> getPlatformAnalysisByCategory(
            @RequestParam String category,
            @ModelAttribute UserSession userSession,
            @RequestParam(required = false) String functionalSubArea,
            @RequestParam(required = false) String industryType) {
        
        log.info("Received request to fetch platform analysis for category: {} - user: {}, session: {}, functionalSubArea: {}, industryType: {}", 
                category, userSession.getUserId(), userSession.getSessionId(), functionalSubArea, industryType);
        
        try {
            // Determine system type based on UI parameters
            String systemType = determineSystemType(functionalSubArea, industryType);
            log.info("Determined system type: {} for category: {}", systemType, category);
            
            PlatformAnalysisResponse response = platformAnalysisService.getPlatformAnalysisByCategory(
                    category,
                    userSession.getUserId(), 
                    userSession.getSessionId(),
                    systemType
            );
            
            // Calculate total number of assets across all categories
            int totalAssets = response.getCategories().stream()
                    .mapToInt(categoryItem -> categoryItem.getAssets().size())
                    .sum();
            
            log.info("Successfully returning {} records for category: {} across {} categories using {} system", 
                    totalAssets, category, response.getCategories().size(), systemType);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error fetching platform analysis records for category: {}", category, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Determines system type based on functionalSubArea or industryType from UI
     */
    private String determineSystemType(String functionalSubArea, String industryType) {
        // Check if it's one of the planning industry types
        if (isIndustryType(industryType)) {
            return "PLANNING";
        }
        
        // Check functional sub area
        if (functionalSubArea != null) {
            String normalized = functionalSubArea.toLowerCase().trim();
            if (normalized.contains("warehouse") || normalized.contains("wms")) {
                return "WMS";
            } else if (normalized.contains("transport") || normalized.contains("tms") || 
                      normalized.contains("transfer")) {
                return "TMS";
            }
        }
        
        log.warn("Could not determine system type from functionalSubArea: {}, industryType: {}, defaulting to WMS", 
                functionalSubArea, industryType);
        return "WMS";
    }
    
    /**
     * Checks if the given string is one of the industry types
     */
    private boolean isIndustryType(String value) {
        if (value == null) {
            return false;
        }
        
        return INDUSTRY_AGNOSTIC.equals(value) || 
               RETAIL_INDUSTRY.equals(value) || 
               CONSUMER_GOODS_INDUSTRY.equals(value);
    }
}