package com.example.DigitalWayfinder.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.example.DigitalWayfinder.dto.PlatformAnalysisResponse;
import com.example.DigitalWayfinder.dto.TmsReportResponse;
import com.example.DigitalWayfinder.dto.CgsReportResponse;
import com.example.DigitalWayfinder.dto.IndustryAgnosticReportResponse;
import com.example.DigitalWayfinder.dto.RetailReportResponse;
import com.example.DigitalWayfinder.entity.PlatformAnalysis;
import com.example.DigitalWayfinder.entity.TmsReport;
import com.example.DigitalWayfinder.entity.CgsReport;
import com.example.DigitalWayfinder.entity.IndustryAgnosticReport;
import com.example.DigitalWayfinder.entity.RetailReport;
import com.example.DigitalWayfinder.entity.ProjectType;
import com.example.DigitalWayfinder.repository.PlatformAnalysisRepository;
import com.example.DigitalWayfinder.repository.TmsReportRepository;
import com.example.DigitalWayfinder.repository.CgsReportRepository;
import com.example.DigitalWayfinder.repository.IndustryAgnosticReportRepository;
import com.example.DigitalWayfinder.repository.RetailReportRepository;
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
    private final CgsReportRepository cgsReportRepository;
    private final IndustryAgnosticReportRepository industryAgnosticReportRepository;
    private final RetailReportRepository retailReportRepository;
    private final ProjectTypeRepository projectTypeRepository;
    
    // System Type constants
    private static final String WMS_SYSTEM = "WMS";
    private static final String TMS_SYSTEM = "TMS";
    private static final String CGS_SYSTEM = "CGS";
    private static final String INDUSTRY_AGNOSTIC_SYSTEM = "INDUSTRYAGNOSTIC";
    private static final String RETAIL_SYSTEM = "RETAIL";
    
    public Object getAllPlatformAnalysis(String userId, String sessionId) {
        return getAllPlatformAnalysis(userId, sessionId, null);
    }
    
    public Object getAllPlatformAnalysis(String userId, String sessionId, String systemType) {
        log.info("Fetching all platform analysis records for user: {}, session: {}, systemType: {}", userId, sessionId, systemType);
        
        try {
            // Get the actual userId and sessionId to use from latest ProjectType
            UserSessionInfo sessionInfo = resolveUserSession(userId, sessionId);
            
            // Use provided systemType or default to WMS
            if (systemType == null || systemType.trim().isEmpty()) {
                systemType = WMS_SYSTEM;
            }
            systemType = systemType.toUpperCase();
            log.info("Using system type: {} for user: {}, session: {}", systemType, sessionInfo.getUserId(), sessionInfo.getSessionId());
            
            switch (systemType) {
                case TMS_SYSTEM:
                    return getTmsAnalysis(sessionInfo, null);
                case CGS_SYSTEM:
                    return getCgsAnalysis(sessionInfo, null);
                case INDUSTRY_AGNOSTIC_SYSTEM:
                    return getIndustryAgnosticAnalysis(sessionInfo, null);
                case RETAIL_SYSTEM:
                    return getRetailAnalysis(sessionInfo, null);
                case WMS_SYSTEM:
                default:
                    return getWmsAnalysis(sessionInfo, null);
            }
                    
        } catch (Exception e) {
            log.error("Error fetching platform analysis records", e);
            throw new RuntimeException("Failed to fetch platform analysis records: " + e.getMessage());
        }
    }

    public Object getPlatformAnalysisByCategory(String category, String userId, String sessionId) {
        return getPlatformAnalysisByCategory(category, userId, sessionId, null);
    }
    
    public Object getPlatformAnalysisByCategory(String category, String userId, String sessionId, String systemType) {
        log.info("Fetching platform analysis records for category: {} with user: {}, session: {}, systemType: {}", 
                category, userId, sessionId, systemType);
        
        try {
            // Get the actual userId and sessionId to use from latest ProjectType
            UserSessionInfo sessionInfo = resolveUserSession(userId, sessionId);
            
            // Use provided systemType or default to WMS
            if (systemType == null || systemType.trim().isEmpty()) {
                systemType = WMS_SYSTEM;
            }
            systemType = systemType.toUpperCase();
            log.info("Using system type: {} for category: {}", systemType, category);
            
            switch (systemType) {
                case TMS_SYSTEM:
                    return getTmsAnalysis(sessionInfo, category);
                case CGS_SYSTEM:
                    return getCgsAnalysis(sessionInfo, category);
                case INDUSTRY_AGNOSTIC_SYSTEM:
                    return getIndustryAgnosticAnalysis(sessionInfo, category);
                case RETAIL_SYSTEM:
                    return getRetailAnalysis(sessionInfo, category);
                case WMS_SYSTEM:
                default:
                    return getWmsAnalysis(sessionInfo, category);
            }
                    
        } catch (Exception e) {
            log.error("Error fetching platform analysis records for category: {}", category, e);
            throw new RuntimeException("Failed to fetch records: " + e.getMessage());
        }
    }
    
    // =================== WMS METHODS ===================
    
    private PlatformAnalysisResponse getWmsAnalysis(UserSessionInfo sessionInfo, String category) {
        List<PlatformAnalysis> records;
        
        if (category != null) {
            records = platformAnalysisRepository.findByCategoryAndUserIDAndSessionIDIncludingNulls(
                category, sessionInfo.getUserId(), sessionInfo.getSessionId());
        } else {
            records = platformAnalysisRepository.findByUserIDAndSessionIDIncludingNulls(
                sessionInfo.getUserId(), sessionInfo.getSessionId());
        }
        
        List<PlatformAnalysis> uniqueRecords = removeDuplicates(records);
        List<PlatformAnalysisResponse.CategoryItem> categories = groupRecordsByCategory(uniqueRecords);
        
        log.info("Successfully fetched {} WMS records (after deduplication: {}) grouped into {} categories", 
                records.size(), uniqueRecords.size(), categories.size());
        
        return PlatformAnalysisResponse.builder()
                .userId(sessionInfo.getUserId())
                .sessionId(sessionInfo.getSessionId())
                .categories(categories)
                .build();
    }
    
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
    
    private TmsReportResponse getTmsAnalysis(UserSessionInfo sessionInfo, String category) {
        List<TmsReport> records;
        
        if (category != null) {
            records = tmsReportRepository.findByCategoryAndUserIDAndSessionIDIncludingNulls(
                category, sessionInfo.getUserId(), sessionInfo.getSessionId());
            log.info("DEBUG: Found {} TMS records for specific category: {}", records.size(), category);
        } else {
            records = tmsReportRepository.findByUserIDAndSessionIDIncludingNulls(
                sessionInfo.getUserId(), sessionInfo.getSessionId());
            log.info("DEBUG: Found {} total TMS records for user: {}, session: {}", 
                    records.size(), sessionInfo.getUserId(), sessionInfo.getSessionId());
        }
        
        // Debug: Log all records before deduplication
        log.info("DEBUG: TMS Records before deduplication:");
        records.forEach(record -> {
            log.info("  - Asset: {}, Category: {}, UserID: {}, SessionID: {}", 
                    record.getAssetName(), record.getCategory(), 
                    record.getUserID(), record.getSessionID());
        });
        
        // Debug: Check for null or empty asset names
        long emptyAssetNames = records.stream()
                .filter(record -> record.getAssetName() == null || record.getAssetName().trim().isEmpty())
                .count();
        log.info("DEBUG: Found {} records with null/empty asset names that will be filtered out", emptyAssetNames);
        
        List<TmsReport> uniqueRecords = removeTmsDuplicates(records);
        log.info("DEBUG: After deduplication: {} unique TMS records", uniqueRecords.size());
        
        // Debug: Log unique records after deduplication
        log.info("DEBUG: TMS Records after deduplication:");
        uniqueRecords.forEach(record -> {
            log.info("  - Asset: {}, Category: {}", record.getAssetName(), record.getCategory());
        });
        
        // Debug: Group by category and log the grouping
        Map<String, List<TmsReport>> groupedRecords = uniqueRecords.stream()
                .collect(Collectors.groupingBy(TmsReport::getCategory));
        
        log.info("DEBUG: TMS Records grouped by category:");
        groupedRecords.forEach((cat, recordList) -> {
            log.info("  - Category: {} has {} records", cat, recordList.size());
            recordList.forEach(record -> {
                log.info("    * Asset: {}, Gaps: {}", record.getAssetName(), record.getGaps());
            });
        });
        
        List<TmsReportResponse.CategoryItem> categories = groupTmsRecordsByCategory(uniqueRecords);
        
        log.info("Successfully fetched {} TMS records (after deduplication: {}) grouped into {} categories", 
                records.size(), uniqueRecords.size(), categories.size());
        
        return TmsReportResponse.builder()
                .userId(sessionInfo.getUserId())
                .sessionId(sessionInfo.getSessionId())
                .categories(categories)
                .build();
    }
    
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
    
    private List<TmsReportResponse.CategoryItem> groupTmsRecordsByCategory(List<TmsReport> records) {
        Map<String, List<TmsReport>> groupedRecords = records.stream()
                .collect(Collectors.groupingBy(TmsReport::getCategory));
        
        return groupedRecords.entrySet().stream()
                .map(entry -> {
                    String categoryName = entry.getKey();
                    List<TmsReportResponse.AssetItem> assets = entry.getValue().stream()
                            .map(this::convertTmsToAssetItem)
                            .collect(Collectors.toList());
                    
                    return TmsReportResponse.CategoryItem.builder()
                            .categoryName(categoryName)
                            .assets(assets)
                            .build();
                })
                .collect(Collectors.toList());
    }
    
    private TmsReportResponse.AssetItem convertTmsToAssetItem(TmsReport entity) {
        return TmsReportResponse.AssetItem.builder()
                .assetName(entity.getAssetName())
                .gaps(entity.getGaps())
                .build();
    }
    
    // =================== CGS METHODS ===================
    
    private CgsReportResponse getCgsAnalysis(UserSessionInfo sessionInfo, String category) {
        List<CgsReport> records;
        
        if (category != null) {
            records = cgsReportRepository.findByCategoryAndUserIDAndSessionIDIncludingNulls(
                category, sessionInfo.getUserId(), sessionInfo.getSessionId());
        } else {
            records = cgsReportRepository.findByUserIDAndSessionIDIncludingNulls(
                sessionInfo.getUserId(), sessionInfo.getSessionId());
        }
        
        List<CgsReport> uniqueRecords = removeCgsDuplicates(records);
        List<CgsReportResponse.CategoryItem> categories = groupCgsRecordsByCategory(uniqueRecords);
        
        log.info("Successfully fetched {} CGS records (after deduplication: {}) grouped into {} categories", 
                records.size(), uniqueRecords.size(), categories.size());
        
        return CgsReportResponse.builder()
                .userId(sessionInfo.getUserId())
                .sessionId(sessionInfo.getSessionId())
                .categories(categories)
                .build();
    }
    
    private List<CgsReport> removeCgsDuplicates(List<CgsReport> records) {
        return records.stream()
                .filter(record -> record.getAssetName() != null && !record.getAssetName().trim().isEmpty())
                .collect(Collectors.toMap(
                    CgsReport::getAssetName,
                    record -> record,
                    (existing, replacement) -> existing
                ))
                .values()
                .stream()
                .collect(Collectors.toList());
    }
    
    private List<CgsReportResponse.CategoryItem> groupCgsRecordsByCategory(List<CgsReport> records) {
        Map<String, List<CgsReport>> groupedRecords = records.stream()
                .collect(Collectors.groupingBy(CgsReport::getCategory));
        
        return groupedRecords.entrySet().stream()
                .map(entry -> {
                    String categoryName = entry.getKey();
                    List<CgsReportResponse.AssetItem> assets = entry.getValue().stream()
                            .map(this::convertCgsToAssetItem)
                            .collect(Collectors.toList());
                    
                    return CgsReportResponse.CategoryItem.builder()
                            .categoryName(categoryName)
                            .assets(assets)
                            .build();
                })
                .collect(Collectors.toList());
    }
    
    private CgsReportResponse.AssetItem convertCgsToAssetItem(CgsReport entity) {
        return CgsReportResponse.AssetItem.builder()
                .assetName(entity.getAssetName())
                .gaps(entity.getGaps())
                .build();
    }
    
    // =================== INDUSTRY AGNOSTIC METHODS ===================
    
    private IndustryAgnosticReportResponse getIndustryAgnosticAnalysis(UserSessionInfo sessionInfo, String category) {
        List<IndustryAgnosticReport> records;
        
        if (category != null) {
            records = industryAgnosticReportRepository.findByCategoryAndUserIDAndSessionIDIncludingNulls(
                category, sessionInfo.getUserId(), sessionInfo.getSessionId());
        } else {
            records = industryAgnosticReportRepository.findByUserIDAndSessionIDIncludingNulls(
                sessionInfo.getUserId(), sessionInfo.getSessionId());
        }
        
        List<IndustryAgnosticReport> uniqueRecords = removeIndustryAgnosticDuplicates(records);
        List<IndustryAgnosticReportResponse.CategoryItem> categories = groupIndustryAgnosticRecordsByCategory(uniqueRecords);
        
        log.info("Successfully fetched {} Industry Agnostic records (after deduplication: {}) grouped into {} categories", 
                records.size(), uniqueRecords.size(), categories.size());
        
        return IndustryAgnosticReportResponse.builder()
                .userId(sessionInfo.getUserId())
                .sessionId(sessionInfo.getSessionId())
                .categories(categories)
                .build();
    }
    
    private List<IndustryAgnosticReport> removeIndustryAgnosticDuplicates(List<IndustryAgnosticReport> records) {
        return records.stream()
                .filter(record -> record.getAssetName() != null && !record.getAssetName().trim().isEmpty())
                .collect(Collectors.toMap(
                    IndustryAgnosticReport::getAssetName,
                    record -> record,
                    (existing, replacement) -> existing
                ))
                .values()
                .stream()
                .collect(Collectors.toList());
    }
    
    private List<IndustryAgnosticReportResponse.CategoryItem> groupIndustryAgnosticRecordsByCategory(List<IndustryAgnosticReport> records) {
        Map<String, List<IndustryAgnosticReport>> groupedRecords = records.stream()
                .collect(Collectors.groupingBy(IndustryAgnosticReport::getCategory));
        
        return groupedRecords.entrySet().stream()
                .map(entry -> {
                    String categoryName = entry.getKey();
                    List<IndustryAgnosticReportResponse.AssetItem> assets = entry.getValue().stream()
                            .map(this::convertIndustryAgnosticToAssetItem)
                            .collect(Collectors.toList());
                    
                    return IndustryAgnosticReportResponse.CategoryItem.builder()
                            .categoryName(categoryName)
                            .assets(assets)
                            .build();
                })
                .collect(Collectors.toList());
    }
    
    private IndustryAgnosticReportResponse.AssetItem convertIndustryAgnosticToAssetItem(IndustryAgnosticReport entity) {
        return IndustryAgnosticReportResponse.AssetItem.builder()
                .assetName(entity.getAssetName())
                .gaps(entity.getGaps())
                .build();
    }
    
    // =================== RETAIL METHODS ===================
    
    private RetailReportResponse getRetailAnalysis(UserSessionInfo sessionInfo, String category) {
        List<RetailReport> records;
        
        if (category != null) {
            records = retailReportRepository.findByCategoryAndUserIDAndSessionIDIncludingNulls(
                category, sessionInfo.getUserId(), sessionInfo.getSessionId());
        } else {
            records = retailReportRepository.findByUserIDAndSessionIDIncludingNulls(
                sessionInfo.getUserId(), sessionInfo.getSessionId());
        }
        
        List<RetailReport> uniqueRecords = removeRetailDuplicates(records);
        List<RetailReportResponse.CategoryItem> categories = groupRetailRecordsByCategory(uniqueRecords);
        
        log.info("Successfully fetched {} Retail records (after deduplication: {}) grouped into {} categories", 
                records.size(), uniqueRecords.size(), categories.size());
        
        return RetailReportResponse.builder()
                .userId(sessionInfo.getUserId())
                .sessionId(sessionInfo.getSessionId())
                .categories(categories)
                .build();
    }
    
    private List<RetailReport> removeRetailDuplicates(List<RetailReport> records) {
        return records.stream()
                .filter(record -> record.getAssetName() != null && !record.getAssetName().trim().isEmpty())
                .collect(Collectors.toMap(
                    RetailReport::getAssetName,
                    record -> record,
                    (existing, replacement) -> existing
                ))
                .values()
                .stream()
                .collect(Collectors.toList());
    }
    
    private List<RetailReportResponse.CategoryItem> groupRetailRecordsByCategory(List<RetailReport> records) {
        Map<String, List<RetailReport>> groupedRecords = records.stream()
                .collect(Collectors.groupingBy(RetailReport::getCategory));
        
        return groupedRecords.entrySet().stream()
                .map(entry -> {
                    String categoryName = entry.getKey();
                    List<RetailReportResponse.AssetItem> assets = entry.getValue().stream()
                            .map(this::convertRetailToAssetItem)
                            .collect(Collectors.toList());
                    
                    return RetailReportResponse.CategoryItem.builder()
                            .categoryName(categoryName)
                            .assets(assets)
                            .build();
                })
                .collect(Collectors.toList());
    }
    
    private RetailReportResponse.AssetItem convertRetailToAssetItem(RetailReport entity) {
        return RetailReportResponse.AssetItem.builder()
                .assetName(entity.getAssetName())
                .gaps(entity.getGaps())
                .build();
    }
    
    // =================== HELPER METHODS ===================
    
    /**
     * Determines system type based on functionalSubArea or industryType from UI
     */
    private String determineSystemType(String functionalSubArea, String industryType) {
        // Check if it's one of the specific system types
        if (industryType != null) {
            String normalized = industryType.toUpperCase().trim();
            switch (normalized) {
                case "CONSUMER GOODS INDUSTRY SPECIFIC":
                case "CGS":
                    return CGS_SYSTEM;
                case "INDUSTRY AGNOSTIC":
                case "INDUSTRYAGNOSTIC":
                    return INDUSTRY_AGNOSTIC_SYSTEM;
                case "RETAIL INDUSTRY SPECIFIC":
                case "RETAIL":
                    return RETAIL_SYSTEM;
            }
        }
        
        // Check functional sub area
        if (functionalSubArea != null) {
            String normalized = functionalSubArea.toLowerCase().trim();
            if (normalized.contains("warehouse") || normalized.contains("wms")) {
                return WMS_SYSTEM;
            } else if (normalized.contains("transport") || normalized.contains("tms") || 
                      normalized.contains("transfer")) {
                return TMS_SYSTEM;
            }
        }
        
        log.warn("Could not determine system type from functionalSubArea: {}, industryType: {}, defaulting to WMS", 
                functionalSubArea, industryType);
        return WMS_SYSTEM;
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