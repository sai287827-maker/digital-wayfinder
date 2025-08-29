package com.example.DigitalWayfinder.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.example.DigitalWayfinder.dto.PlatformAnalysisResponse;
import com.example.DigitalWayfinder.entity.PlatformAnalysis;
import com.example.DigitalWayfinder.entity.TmsReport;
import com.example.DigitalWayfinder.entity.PlanningReport;
import com.example.DigitalWayfinder.entity.ProjectType;
import com.example.DigitalWayfinder.repository.PlatformAnalysisRepository;
import com.example.DigitalWayfinder.repository.TmsReportRepository;
import com.example.DigitalWayfinder.repository.PlanningReportRepository;
import com.example.DigitalWayfinder.repository.ProjectTypeRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlatformAnalysisService {
    
    private final PlatformAnalysisRepository platformAnalysisRepository;
    private final TmsReportRepository tmsReportRepository;
    private final PlanningReportRepository planningReportRepository;
    private final ProjectTypeRepository projectTypeRepository;
    
    // Industry Type constants
    private static final String INDUSTRY_AGNOSTIC = "Industry Agnostic";
    private static final String RETAIL_INDUSTRY = "Retail Industry Specific";
    private static final String CONSUMER_GOODS_INDUSTRY = "Consumer Goods Industry Specific";
    
    public PlatformAnalysisResponse getAllPlatformAnalysis(String userId, String sessionId) {
        return getAllPlatformAnalysis(userId, sessionId, null);
    }
    
    public PlatformAnalysisResponse getAllPlatformAnalysis(String userId, String sessionId, String systemType) {
        log.info("Fetching all platform analysis records for user: {}, session: {}, systemType: {}", userId, sessionId, systemType);
        
        try {
            // Get the actual userId and sessionId to use from latest ProjectType
            UserSessionInfo sessionInfo = resolveUserSession(userId, sessionId);
            
            // Use provided systemType or default to WMS
            if (systemType == null || systemType.trim().isEmpty()) {
                systemType = "WMS";
            }
            log.info("Using system type: {} for user: {}, session: {}", systemType, sessionInfo.getUserId(), sessionInfo.getSessionId());
            
            List<PlatformAnalysisResponse.CategoryItem> categories;
            
            if ("TMS".equals(systemType)) {
                // Fetch from TmsReport
                List<TmsReport> records = tmsReportRepository.findByUserIDAndSessionID(
                    sessionInfo.getUserId(), sessionInfo.getSessionId());
                List<TmsReport> uniqueRecords = removeTmsDuplicates(records);
                categories = groupTmsRecordsByCategory(uniqueRecords);
                log.info("Successfully fetched {} TMS records (after deduplication: {}) grouped into {} categories", 
                        records.size(), uniqueRecords.size(), categories.size());
                
            } else if ("PLANNING".equals(systemType)) {
                // Fetch from PlanningReport
                List<PlanningReport> records = planningReportRepository.findByUserIDAndSessionID(
                    sessionInfo.getUserId(), sessionInfo.getSessionId());
                List<PlanningReport> uniqueRecords = removePlanningDuplicates(records);
                categories = groupPlanningRecordsByCategory(uniqueRecords);
                log.info("Successfully fetched {} Planning records (after deduplication: {}) grouped into {} categories", 
                        records.size(), uniqueRecords.size(), categories.size());
                
            } else {
                // Default to WMS - Fetch from PlatformAnalysis
                List<PlatformAnalysis> records = platformAnalysisRepository.findByUserIDAndSessionID(
                    sessionInfo.getUserId(), sessionInfo.getSessionId());
                List<PlatformAnalysis> uniqueRecords = removeDuplicates(records);
                categories = groupRecordsByCategory(uniqueRecords);
                log.info("Successfully fetched {} WMS records (after deduplication: {}) grouped into {} categories", 
                        records.size(), uniqueRecords.size(), categories.size());
            }
            
            return PlatformAnalysisResponse.builder()
                    .userId(sessionInfo.getUserId())
                    .sessionId(sessionInfo.getSessionId())
                    .categories(categories)
                    .build();
                    
        } catch (Exception e) {
            log.error("Error fetching platform analysis records", e);
            throw new RuntimeException("Failed to fetch platform analysis records: " + e.getMessage());
        }
    }

    public PlatformAnalysisResponse getPlatformAnalysisByCategory(String category, String userId, String sessionId) {
        return getPlatformAnalysisByCategory(category, userId, sessionId, null);
    }
    
    public PlatformAnalysisResponse getPlatformAnalysisByCategory(String category, String userId, String sessionId, String systemType) {
        log.info("Fetching platform analysis records for category: {} with user: {}, session: {}, systemType: {}", 
                category, userId, sessionId, systemType);
        
        try {
            // Get the actual userId and sessionId to use from latest ProjectType
            UserSessionInfo sessionInfo = resolveUserSession(userId, sessionId);
            
            // Use provided systemType or default to WMS
            if (systemType == null || systemType.trim().isEmpty()) {
                systemType = "WMS";
            }
            log.info("Using system type: {} for category: {}", systemType, category);
            
            List<PlatformAnalysisResponse.CategoryItem> categories;
            
            if ("TMS".equals(systemType)) {
                // Fetch from TmsReport by category
                List<TmsReport> records = tmsReportRepository.findByCategoryAndUserIDAndSessionID(
                    category, sessionInfo.getUserId(), sessionInfo.getSessionId());
                List<TmsReport> uniqueRecords = removeTmsDuplicates(records);
                categories = groupTmsRecordsByCategory(uniqueRecords);
                log.info("Successfully fetched {} TMS records (after deduplication: {}) for category: {}", 
                        records.size(), uniqueRecords.size(), category);
                
            } else if ("PLANNING".equals(systemType)) {
                // Fetch from PlanningReport by category
                List<PlanningReport> records = planningReportRepository.findByCategoryAndUserIDAndSessionID(
                    category, sessionInfo.getUserId(), sessionInfo.getSessionId());
                List<PlanningReport> uniqueRecords = removePlanningDuplicates(records);
                categories = groupPlanningRecordsByCategory(uniqueRecords);
                log.info("Successfully fetched {} Planning records (after deduplication: {}) for category: {}", 
                        records.size(), uniqueRecords.size(), category);
                
            } else {
                // Default to WMS - Fetch from PlatformAnalysis by category
                List<PlatformAnalysis> records = platformAnalysisRepository.findByCategoryAndUserIDAndSessionID(
                    category, sessionInfo.getUserId(), sessionInfo.getSessionId());
                List<PlatformAnalysis> uniqueRecords = removeDuplicates(records);
                categories = groupRecordsByCategory(uniqueRecords);
                log.info("Successfully fetched {} WMS records (after deduplication: {}) for category: {}", 
                        records.size(), uniqueRecords.size(), category);
            }
            
            return PlatformAnalysisResponse.builder()
                    .userId(sessionInfo.getUserId())
                    .sessionId(sessionInfo.getSessionId())
                    .categories(categories)
                    .build();
                    
        } catch (Exception e) {
            log.error("Error fetching platform analysis records for category: {}", category, e);
            throw new RuntimeException("Failed to fetch records: " + e.getMessage());
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
    
    // =================== WMS METHODS (Original) ===================
    
    private List<PlatformAnalysis> removeDuplicates(List<PlatformAnalysis> records) {
        return records.stream()
                .filter(record -> record.getAssetName() != null && !record.getAssetName().trim().isEmpty())
                .collect(Collectors.toMap(
                    PlatformAnalysis::getAssetName,
                    record -> record,
                    (existing, replacement) -> existing
                ))
                .values()
                .stream()
                .collect(Collectors.toList());
    }
    
    private List<PlatformAnalysisResponse.CategoryItem> groupRecordsByCategory(List<PlatformAnalysis> records) {
        Map<String, List<PlatformAnalysis>> groupedRecords = records.stream()
                .collect(Collectors.groupingBy(PlatformAnalysis::getCategory));
        
        return groupedRecords.entrySet().stream()
                .map(entry -> {
                    String categoryName = entry.getKey();
                    List<PlatformAnalysisResponse.AssetItem> assets = entry.getValue().stream()
                            .map(this::convertToAssetItem)
                            .collect(Collectors.toList());
                    
                    return PlatformAnalysisResponse.CategoryItem.builder()
                            .categoryName(categoryName)
                            .assets(assets)
                            .build();
                })
                .collect(Collectors.toList());
    }
    
    private PlatformAnalysisResponse.AssetItem convertToAssetItem(PlatformAnalysis entity) {
        return PlatformAnalysisResponse.AssetItem.builder()
                .assetName(entity.getAssetName())
                .gaps(entity.getGaps())
                .build();
    }
    
    // =================== TMS METHODS ===================
    
    private List<TmsReport> removeTmsDuplicates(List<TmsReport> records) {
        return records.stream()
                .filter(record -> record.getAssetName() != null && !record.getAssetName().trim().isEmpty())
                .collect(Collectors.toMap(
                    TmsReport::getAssetName,
                    record -> record,
                    (existing, replacement) -> existing
                ))
                .values()
                .stream()
                .collect(Collectors.toList());
    }
    
    private List<PlatformAnalysisResponse.CategoryItem> groupTmsRecordsByCategory(List<TmsReport> records) {
        Map<String, List<TmsReport>> groupedRecords = records.stream()
                .collect(Collectors.groupingBy(TmsReport::getCategory));
        
        return groupedRecords.entrySet().stream()
                .map(entry -> {
                    String categoryName = entry.getKey();
                    List<PlatformAnalysisResponse.AssetItem> assets = entry.getValue().stream()
                            .map(this::convertTmsToAssetItem)
                            .collect(Collectors.toList());
                    
                    return PlatformAnalysisResponse.CategoryItem.builder()
                            .categoryName(categoryName)
                            .assets(assets)
                            .build();
                })
                .collect(Collectors.toList());
    }
    
    private PlatformAnalysisResponse.AssetItem convertTmsToAssetItem(TmsReport entity) {
        return PlatformAnalysisResponse.AssetItem.builder()
                .assetName(entity.getAssetName())
                .gaps(entity.getGaps())
                .build();
    }
    
    // =================== PLANNING METHODS ===================
    
    private List<PlanningReport> removePlanningDuplicates(List<PlanningReport> records) {
        return records.stream()
                .filter(record -> record.getAssetName() != null && !record.getAssetName().trim().isEmpty())
                .collect(Collectors.toMap(
                    PlanningReport::getAssetName,
                    record -> record,
                    (existing, replacement) -> existing
                ))
                .values()
                .stream()
                .collect(Collectors.toList());
    }
    
    private List<PlatformAnalysisResponse.CategoryItem> groupPlanningRecordsByCategory(List<PlanningReport> records) {
        Map<String, List<PlanningReport>> groupedRecords = records.stream()
                .collect(Collectors.groupingBy(PlanningReport::getCategory));
        
        return groupedRecords.entrySet().stream()
                .map(entry -> {
                    String categoryName = entry.getKey();
                    List<PlatformAnalysisResponse.AssetItem> assets = entry.getValue().stream()
                            .map(this::convertPlanningToAssetItem)
                            .collect(Collectors.toList());
                    
                    return PlatformAnalysisResponse.CategoryItem.builder()
                            .categoryName(categoryName)
                            .assets(assets)
                            .build();
                })
                .collect(Collectors.toList());
    }
    
    private PlatformAnalysisResponse.AssetItem convertPlanningToAssetItem(PlanningReport entity) {
        return PlatformAnalysisResponse.AssetItem.builder()
                .assetName(entity.getAssetName())
                .gaps(entity.getGaps())
                .build();
    }
    
    // =================== HELPER METHODS ===================
    
    /**
     * Resolves the actual userId and sessionId to use.
     * Gets the latest session from ProjectType table using createdDate.
     */
    private UserSessionInfo resolveUserSession(String userId, String sessionId) {
        // If both userId and sessionId are provided, use them directly
        if (isValidString(userId) && isValidString(sessionId)) {
            log.info("Using provided session - User: {}, Session: {}", userId, sessionId);
            return new UserSessionInfo(userId, sessionId, true);
        }
        
        // Try to get the latest session from ProjectType table using createdDate
        try {
            Optional<ProjectType> latestProject = projectTypeRepository.findLatestSession();
            
            if (latestProject.isPresent()) {
                ProjectType project = latestProject.get();
                String resolvedUserId = project.getUserID();
                String resolvedSessionId = project.getSessionID();
                
                log.info("Resolved session from latest project (createdDate: {}) - User: {}, Session: {}", 
                    project.getCreatedDate(), resolvedUserId, resolvedSessionId);
                
                return new UserSessionInfo(resolvedUserId, resolvedSessionId, true);
            } else {
                log.warn("No project records found to resolve session, will return records with null userId/sessionId");
                return new UserSessionInfo(null, null, true);
            }
            
        } catch (Exception e) {
            log.error("Error resolving latest session from ProjectType table using createdDate", e);
            return new UserSessionInfo(null, null, true);
        }
    }
    
    private boolean isValidString(String str) {
        return str != null && !str.trim().isEmpty();
    }
    
    // Helper class to hold session resolution result
    private static class UserSessionInfo {
        private final String userId;
        private final String sessionId;
        private final boolean valid;
        
        public UserSessionInfo(String userId, String sessionId, boolean valid) {
            this.userId = userId;
            this.sessionId = sessionId;
            this.valid = valid;
        }
        
        public String getUserId() { return userId; }
        public String getSessionId() { return sessionId; }
        public boolean isValid() { return valid; }
    }
}