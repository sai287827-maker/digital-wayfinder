package com.example.DigitalWayfinder.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.example.DigitalWayfinder.dto.PlatformAnalysisResponse;
import com.example.DigitalWayfinder.entity.PlatformAnalysis;
import com.example.DigitalWayfinder.repository.PlatformAnalysisRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlatformAnalysisService {
    
    private final PlatformAnalysisRepository platformAnalysisRepository;
    
    public PlatformAnalysisResponse getAllPlatformAnalysis(String userId, String sessionId) {
        log.info("Fetching all platform analysis records for user: {}, session: {}", userId, sessionId);
        
        try {
            List<PlatformAnalysis> records = platformAnalysisRepository.findAll();
            
            List<PlatformAnalysisResponse.PlatformAnalysisItem> items = records.stream()
                    .map(this::convertToResponseItem)
                    .collect(Collectors.toList());
            
            log.info("Successfully fetched {} platform analysis records", items.size());
            
            return PlatformAnalysisResponse.builder()
                    .userId(userId)
                    .sessionId(sessionId)
                    .reportData(items)
                    .build();
                    
        } catch (Exception e) {
            log.error("Error fetching platform analysis records", e);
            throw new RuntimeException("Failed to fetch platform analysis records: " + e.getMessage());
        }
    }
    
    public PlatformAnalysisResponse getPlatformAnalysisByCategory(String category, String userId, String sessionId) {
        log.info("Fetching platform analysis records for category: {}", category);
        
        try {
            List<PlatformAnalysis> records = platformAnalysisRepository.findByCategory(category);
            
            List<PlatformAnalysisResponse.PlatformAnalysisItem> items = records.stream()
                    .map(this::convertToResponseItem)
                    .collect(Collectors.toList());
            
            log.info("Successfully fetched {} records for category: {}", items.size(), category);
            
            return PlatformAnalysisResponse.builder()
                    .userId(userId)
                    .sessionId(sessionId)
                    .reportData(items)
                    .build();
                    
        } catch (Exception e) {
            log.error("Error fetching platform analysis records for category: {}", category, e);
            throw new RuntimeException("Failed to fetch records: " + e.getMessage());
        }
    }
    
    private PlatformAnalysisResponse.PlatformAnalysisItem convertToResponseItem(PlatformAnalysis entity) {
        return PlatformAnalysisResponse.PlatformAnalysisItem.builder()
                .assetName(entity.getAssetName())
                .category(entity.getCategory())
                .gaps(entity.getGaps())
                .build();
    }
}