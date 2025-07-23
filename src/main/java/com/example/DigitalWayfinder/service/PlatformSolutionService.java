package com.example.DigitalWayfinder.service;

import com.example.DigitalWayfinder.dto.PlatformSolutionDTO;
import com.example.DigitalWayfinder.entity.InScopePlatform;
import com.example.DigitalWayfinder.repository.InScopePlatformRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlatformSolutionService {
    
    private final InScopePlatformRepository platformRepository;
    
    public List<PlatformSolutionDTO> getAllPlatforms() {
        log.info("Fetching all platform solutions");
        try {
            List<InScopePlatform> platforms = platformRepository.findAll();
            log.info("Retrieved {} platform solutions", platforms.size());
            return platforms.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching all platforms: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch platform solutions", e);
        }
    }
    
    public List<PlatformSolutionDTO> getPlatformsByIndustryType(String industryType) {
        log.info("Fetching platforms for industry type: {}", industryType);
        try {
            List<InScopePlatform> platforms = platformRepository.findByIndustryType(industryType);
            log.info("Retrieved {} platforms for industry type: {}", platforms.size(), industryType);
            return platforms.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching platforms for industry type {}: {}", industryType, e.getMessage(), e);
            throw new RuntimeException("Failed to fetch platforms by industry type", e);
        }
    }
    
    public List<PlatformSolutionDTO> getPlatformsWithFilters(String functionalArea, String industryType, String functionalSubArea) {
        log.info("Fetching platforms with filters - functionalArea: {}, industryType: {}, functionalSubArea: {}", 
                functionalArea, industryType, functionalSubArea);
        try {
            List<InScopePlatform> platforms = platformRepository.findPlatformsByFilters(functionalArea, industryType, functionalSubArea);
            log.info("Retrieved {} platforms with applied filters", platforms.size());
            return platforms.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching platforms with filters: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch platforms with filters", e);
        }
    }
    
    private PlatformSolutionDTO convertToDTO(InScopePlatform platform) {
        return new PlatformSolutionDTO(
                // platform.getKey(),
                platform.getFunctionalArea(),
                platform.getIndustryType(),
                platform.getFunctionalSubArea(),
                platform.getPlatformName(),
                platform.getPlatformImageUrl()
        );
    }
}
