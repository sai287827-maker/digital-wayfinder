package com.example.DigitalWayfinder.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.DigitalWayfinder.dto.PlatformAnalysisResponse;
import com.example.DigitalWayfinder.dto.TmsReportResponse;
import com.example.DigitalWayfinder.dto.CgsReportResponse;
import com.example.DigitalWayfinder.dto.IndustryAgnosticReportResponse;
import com.example.DigitalWayfinder.dto.RetailReportResponse;
import com.example.DigitalWayfinder.dto.UserSession;
import com.example.DigitalWayfinder.entity.TmsReport;
import com.example.DigitalWayfinder.entity.PlatformAnalysis;
import com.example.DigitalWayfinder.repository.TmsReportRepository;
import com.example.DigitalWayfinder.repository.PlatformAnalysisRepository;
import com.example.DigitalWayfinder.service.PlatformAnalysisService;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/digital-wayfinder/questionnaire")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class PlatformAnalysisController {
    
    private final PlatformAnalysisService platformAnalysisService;
    private final TmsReportRepository tmsReportRepository;
    private final PlatformAnalysisRepository platformAnalysisRepository;
    
    // Industry Type constants
    private static final String INDUSTRY_AGNOSTIC = "Industry Agnostic";
    private static final String RETAIL_INDUSTRY = "Retail Industry Specific";
    private static final String CONSUMER_GOODS_INDUSTRY = "Consumer Goods Industry Specific";
    
    @GetMapping("/report")
    public ResponseEntity<Object> getAllPlatformAnalysis(
            @ModelAttribute UserSession userSession,
            @RequestParam(required = false) String functionalSubArea,
            @RequestParam(required = false) String industryType) {
        
        log.info("Received request to fetch all platform analysis records - user: {}, session: {}, functionalSubArea: {}, industryType: {}", 
                userSession.getUserId(), userSession.getSessionId(), functionalSubArea, industryType);
        
        try {
            // Determine system type based on UI parameters
            String systemType = determineSystemType(functionalSubArea, industryType);
            log.info("Determined system type: {} for user: {}, session: {}", systemType, userSession.getUserId(), userSession.getSessionId());
            
            Object response = platformAnalysisService.getAllPlatformAnalysis(
                    userSession.getUserId(), 
                    userSession.getSessionId(),
                    systemType
            );
            
            // Calculate total number of assets across all categories based on response type
            int totalAssets = calculateTotalAssets(response);
            int totalCategories = getCategoriesCount(response);
            
            log.info("Successfully returning {} platform analysis records across {} categories using {} system", 
                    totalAssets, totalCategories, systemType);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error fetching platform analysis records", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/get-by-category")
    public ResponseEntity<Object> getPlatformAnalysisByCategory(
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
            
            Object response = platformAnalysisService.getPlatformAnalysisByCategory(
                    category,
                    userSession.getUserId(), 
                    userSession.getSessionId(),
                    systemType
            );
            
            // Calculate total number of assets across all categories based on response type
            int totalAssets = calculateTotalAssets(response);
            int totalCategories = getCategoriesCount(response);
            
            log.info("Successfully returning {} records for category: {} across {} categories using {} system", 
                    totalAssets, category, totalCategories, systemType);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error fetching platform analysis records for category: {}", category, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/debug/tms-records")
    public ResponseEntity<Map<String, Object>> debugTmsRecords(
            @ModelAttribute UserSession userSession) {
        
        log.info("DEBUG: Fetching all TMS records for user: {}, session: {}", 
                userSession.getUserId(), userSession.getSessionId());
        
        try {
            // Get raw records from repository
            List<TmsReport> allRecords = tmsReportRepository.findByUserIDAndSessionIDIncludingNulls(
                    userSession.getUserId(), userSession.getSessionId());
            
            Map<String, Object> debugInfo = new HashMap<>();
            debugInfo.put("totalRecords", allRecords.size());
            debugInfo.put("userId", userSession.getUserId());
            debugInfo.put("sessionId", userSession.getSessionId());
            
            // Group by category for analysis
            Map<String, List<String>> categorizedAssets = allRecords.stream()
                    .collect(Collectors.groupingBy(
                        record -> record.getCategory() != null ? record.getCategory() : "NULL_CATEGORY",
                        Collectors.mapping(TmsReport::getAssetName, Collectors.toList())
                    ));
            
            debugInfo.put("categorizedAssets", categorizedAssets);
            
            // Check for null/empty asset names
            List<TmsReport> invalidRecords = allRecords.stream()
                    .filter(record -> record.getAssetName() == null || record.getAssetName().trim().isEmpty())
                    .collect(Collectors.toList());
            
            debugInfo.put("invalidAssetNames", invalidRecords.size());
            
            // List all unique categories
            Set<String> uniqueCategories = allRecords.stream()
                    .map(TmsReport::getCategory)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toSet());
            
            debugInfo.put("uniqueCategories", uniqueCategories);
            
            // Detailed record information
            List<Map<String, Object>> recordDetails = allRecords.stream()
                    .map(record -> {
                        Map<String, Object> details = new HashMap<>();
                        details.put("assetName", record.getAssetName());
                        details.put("category", record.getCategory());
                        details.put("gaps", record.getGaps());
                        details.put("userId", record.getUserID());
                        details.put("sessionId", record.getSessionID());
                        return details;
                    })
                    .collect(Collectors.toList());
            
            debugInfo.put("allRecords", recordDetails);
            
            return ResponseEntity.ok(debugInfo);
            
        } catch (Exception e) {
            log.error("Error in debug endpoint", e);
            Map<String, Object> errorInfo = new HashMap<>();
            errorInfo.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorInfo);
        }
    }

    @GetMapping("/debug/compare-systems")
    public ResponseEntity<Map<String, Object>> compareSystemRecords(
            @ModelAttribute UserSession userSession) {
        
        try {
            Map<String, Object> comparison = new HashMap<>();
            
            // Get WMS records
            List<PlatformAnalysis> wmsRecords = platformAnalysisRepository.findByUserIDAndSessionIDIncludingNulls(
                    userSession.getUserId(), userSession.getSessionId());
            
            // Get TMS records  
            List<TmsReport> tmsRecords = tmsReportRepository.findByUserIDAndSessionIDIncludingNulls(
                    userSession.getUserId(), userSession.getSessionId());
            
            comparison.put("wmsRecordCount", wmsRecords.size());
            comparison.put("tmsRecordCount", tmsRecords.size());
            
            // WMS categories
            Set<String> wmsCategories = wmsRecords.stream()
                    .map(PlatformAnalysis::getCategory)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toSet());
            
            // TMS categories
            Set<String> tmsCategories = tmsRecords.stream()
                    .map(TmsReport::getCategory)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toSet());
            
            comparison.put("wmsCategories", wmsCategories);
            comparison.put("tmsCategories", tmsCategories);
            comparison.put("wmsCategoryCount", wmsCategories.size());
            comparison.put("tmsCategoryCount", tmsCategories.size());
            
            return ResponseEntity.ok(comparison);
            
        } catch (Exception e) {
            log.error("Error comparing systems", e);
            Map<String, Object> errorInfo = new HashMap<>();
            errorInfo.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorInfo);
        }
    }
    
    /**
     * Determines system type based on functionalSubArea or industryType from UI
     */
    private String determineSystemType(String functionalSubArea, String industryType) {
        // Check if it's one of the industry types (map to specific system types)
        if (isIndustryType(industryType)) {
            if (INDUSTRY_AGNOSTIC.equals(industryType)) {
                return "INDUSTRYAGNOSTIC";
            } else if (RETAIL_INDUSTRY.equals(industryType)) {
                return "RETAIL";
            } else if (CONSUMER_GOODS_INDUSTRY.equals(industryType)) {
                return "CGS";
            }
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
    
    /**
     * Calculate total assets based on response type
     */
    private int calculateTotalAssets(Object response) {
        if (response instanceof PlatformAnalysisResponse) {
            return ((PlatformAnalysisResponse) response).getCategories().stream()
                    .mapToInt(category -> category.getAssets().size())
                    .sum();
        } else if (response instanceof TmsReportResponse) {
            return ((TmsReportResponse) response).getCategories().stream()
                    .mapToInt(category -> category.getAssets().size())
                    .sum();
        } else if (response instanceof CgsReportResponse) {
            return ((CgsReportResponse) response).getCategories().stream()
                    .mapToInt(category -> category.getAssets().size())
                    .sum();
        } else if (response instanceof IndustryAgnosticReportResponse) {
            return ((IndustryAgnosticReportResponse) response).getCategories().stream()
                    .mapToInt(category -> category.getAssets().size())
                    .sum();
        } else if (response instanceof RetailReportResponse) {
            return ((RetailReportResponse) response).getCategories().stream()
                    .mapToInt(category -> category.getAssets().size())
                    .sum();
        }
        return 0;
    }
    
    /**
     * Get categories count based on response type
     */
    private int getCategoriesCount(Object response) {
        if (response instanceof PlatformAnalysisResponse) {
            return ((PlatformAnalysisResponse) response).getCategories().size();
        } else if (response instanceof TmsReportResponse) {
            return ((TmsReportResponse) response).getCategories().size();
        } else if (response instanceof CgsReportResponse) {
            return ((CgsReportResponse) response).getCategories().size();
        } else if (response instanceof IndustryAgnosticReportResponse) {
            return ((IndustryAgnosticReportResponse) response).getCategories().size();
        } else if (response instanceof RetailReportResponse) {
            return ((RetailReportResponse) response).getCategories().size();
        }
        return 0;
    }
}