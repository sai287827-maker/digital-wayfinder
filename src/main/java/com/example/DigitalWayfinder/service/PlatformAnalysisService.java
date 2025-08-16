package com.example.DigitalWayfinder.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.example.DigitalWayfinder.dto.PlatformAnalysisResponse;
import com.example.DigitalWayfinder.entity.PlatformAnalysis;
import com.example.DigitalWayfinder.entity.ProjectType;
import com.example.DigitalWayfinder.repository.PlatformAnalysisRepository;
import com.example.DigitalWayfinder.repository.ProjectTypeRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlatformAnalysisService {
    
    private final PlatformAnalysisRepository platformAnalysisRepository;
    private final ProjectTypeRepository projectTypeRepository;
    
    public PlatformAnalysisResponse getAllPlatformAnalysis(String userId, String sessionId) {
        log.info("Fetching all platform analysis records for user: {}, session: {}", userId, sessionId);
        
        try {
            // Get the actual userId and sessionId to use
            UserSessionInfo sessionInfo = resolveUserSession(userId, sessionId);
            
            // Since PlatformAnalysis table doesn't have userId/sessionId columns,
            // we'll fetch all records and return them with the resolved session info
            List<PlatformAnalysis> records = platformAnalysisRepository.findAll();
            
            List<PlatformAnalysisResponse.CategoryItem> categories = groupRecordsByCategory(records);
            
            log.info("Successfully fetched {} platform analysis records grouped into {} categories", 
                    records.size(), categories.size());
            
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
        log.info("Fetching platform analysis records for category: {}", category);
        
        try {
            // Get the actual userId and sessionId to use
            UserSessionInfo sessionInfo = resolveUserSession(userId, sessionId);
            
            // Filter by category only (since no userId/sessionId in PlatformAnalysis table)
            List<PlatformAnalysis> records = platformAnalysisRepository.findByCategory(category);
            
            List<PlatformAnalysisResponse.CategoryItem> categories = groupRecordsByCategory(records);
            
            log.info("Successfully fetched {} records for category: {}", records.size(), category);
            
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
                String resolvedUserId = project.getUserID();    // Note: getUserID() with capital letters
                String resolvedSessionId = project.getSessionID(); // Note: getSessionID() with capital letters
                
                log.info("Resolved session from latest project (createdDate: {}) - User: {}, Session: {}", 
                    project.getCreatedDate(), resolvedUserId, resolvedSessionId);
                
                return new UserSessionInfo(resolvedUserId, resolvedSessionId, true);
            } else {
                log.warn("No project records found to resolve session");
                // Return some default values or handle as needed
                return new UserSessionInfo("UNKNOWN", "UNKNOWN", false);
            }
            
        } catch (Exception e) {
            log.error("Error resolving latest session from ProjectType table using createdDate", e);
            return new UserSessionInfo("ERROR", "ERROR", false);
        }
    }
    
    private boolean isValidString(String str) {
        return str != null && !str.trim().isEmpty();
    }
    
    private List<PlatformAnalysisResponse.CategoryItem> groupRecordsByCategory(List<PlatformAnalysis> records) {
        // Group records by category
        Map<String, List<PlatformAnalysis>> groupedRecords = records.stream()
                .collect(Collectors.groupingBy(PlatformAnalysis::getCategory));
        
        // Convert grouped records to CategoryItem list
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