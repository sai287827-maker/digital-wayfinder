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
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlatformAnalysisService {
    
    private final PlatformAnalysisRepository platformAnalysisRepository;
    private final ProjectTypeRepository projectTypeRepository;
    
    public PlatformAnalysisResponse getAllPlatformAnalysis(String userId, String sessionId) {
        log.info("Fetching all platform analysis records for user: {}, session: {}", userId, sessionId);
        
        try {
            // Get the actual userId and sessionId to use from latest ProjectType
            UserSessionInfo sessionInfo = resolveUserSession(userId, sessionId);
            
            // Fetch records based on resolved UserID and SessionID (including null handling)
            List<PlatformAnalysis> records = platformAnalysisRepository
                    .findByUserIDAndSessionIDIncludingNulls(sessionInfo.getUserId(), sessionInfo.getSessionId());
            
            // Remove duplicates before grouping
            List<PlatformAnalysis> uniqueRecords = removeDuplicates(records);
            
            List<PlatformAnalysisResponse.CategoryItem> categories = groupRecordsByCategory(uniqueRecords);
            
            log.info("Successfully fetched {} platform analysis records (after deduplication: {}) grouped into {} categories for user: {}, session: {}", 
                    records.size(), uniqueRecords.size(), categories.size(), sessionInfo.getUserId(), sessionInfo.getSessionId());
            
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
        log.info("Fetching platform analysis records for category: {} with user: {}, session: {}", 
                category, userId, sessionId);
        
        try {
            // Get the actual userId and sessionId to use from latest ProjectType
            UserSessionInfo sessionInfo = resolveUserSession(userId, sessionId);
            
            // Filter by category, UserID and SessionID (including null handling)
            List<PlatformAnalysis> records = platformAnalysisRepository
                    .findByCategoryAndUserIDAndSessionIDIncludingNulls(category, sessionInfo.getUserId(), sessionInfo.getSessionId());
            
            // Remove duplicates before grouping
            List<PlatformAnalysis> uniqueRecords = removeDuplicates(records);
            
            List<PlatformAnalysisResponse.CategoryItem> categories = groupRecordsByCategory(uniqueRecords);
            
            log.info("Successfully fetched {} records (after deduplication: {}) for category: {} with user: {}, session: {}", 
                    records.size(), uniqueRecords.size(), category, sessionInfo.getUserId(), sessionInfo.getSessionId());
            
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
     * Removes duplicate records and filters out records with null asset names.
     * Keeps the first occurrence of each unique combination based on assetName, category, and gaps.
     */
private List<PlatformAnalysis> removeDuplicates(List<PlatformAnalysis> records) {
    return records.stream()
            // Filter out records where assetName is null or empty
            .filter(record -> record.getAssetName() != null && !record.getAssetName().trim().isEmpty())
            .collect(Collectors.toMap(
                // Key: Use only assetName as the unique key
                PlatformAnalysis::getAssetName,
                // Value: The record itself
                record -> record,
                // Merge function: Keep the first occurrence in case of duplicates
                (existing, replacement) -> existing
            ))
            .values()
            .stream()
            .collect(Collectors.toList());
}
    
    /**
     * Creates a unique key for deduplication.
     * Handles null values by converting them to empty strings.
     */
    private String createUniqueKey(String assetName, String category, String gaps) {
        String safeAssetName = Objects.toString(assetName, "");
        String safeCategory = Objects.toString(category, "");
        String safeGaps = Objects.toString(gaps, "");
        
        return safeAssetName + "|" + safeCategory + "|" + safeGaps;
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
                String resolvedUserId = project.getUserID();
                String resolvedSessionId = project.getSessionID();
                
                log.info("Resolved session from latest project (createdDate: {}) - User: {}, Session: {}", 
                    project.getCreatedDate(), resolvedUserId, resolvedSessionId);
                
                return new UserSessionInfo(resolvedUserId, resolvedSessionId, true);
            } else {
                log.warn("No project records found to resolve session, will return records with null userId/sessionId");
                // Return null values to fetch records with null userId/sessionId
                return new UserSessionInfo(null, null, true);
            }
            
        } catch (Exception e) {
            log.error("Error resolving latest session from ProjectType table using createdDate", e);
            // Return null values to fetch records with null userId/sessionId
            return new UserSessionInfo(null, null, true);
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