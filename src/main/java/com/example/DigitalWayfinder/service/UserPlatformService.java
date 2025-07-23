package com.example.DigitalWayfinder.service;

import com.example.DigitalWayfinder.dto.SolutionSelectionRequest;
import com.example.DigitalWayfinder.dto.SolutionSelectionResponse;
import com.example.DigitalWayfinder.entity.FunctionalAreaDT;
import com.example.DigitalWayfinder.entity.UserPlatform;
import com.example.DigitalWayfinder.repository.FunctionalAreaDTRepository;
import com.example.DigitalWayfinder.repository.UserPlatformRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;


@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class UserPlatformService {
    
    private final UserPlatformRepository userPlatformRepository;
    private final FunctionalAreaDTRepository functionalAreaDTRepository;

    
    public SolutionSelectionResponse saveSolutionSelection(SolutionSelectionRequest request,String userId, String sessionId) {
        log.info("Saving solution selection for user: {} session: {} platforms: {}", 
                userId, sessionId, request.getSelectedPlatforms());
        
        try {
            // Clear existing selections for this user session
            userPlatformRepository.deleteByUserIdAndSessionId(userId, sessionId);
            log.debug("Cleared existing platform selections for user: {} session: {}", 
                    userId, sessionId);

            FunctionalAreaDT previousProcess = functionalAreaDTRepository
            .findByUserIdAndSessionId(userId, sessionId)
            .orElseThrow(() -> new RuntimeException("Previous functional process not found"));
        
            
            // Create UserPlatform entities for each selected platform
            List<UserPlatform> platforms = request.getSelectedPlatforms().stream()
                    .map(platform -> UserPlatform.builder()
                            .userId(userId)
                            .sessionId(sessionId)
                            .functionalArea(previousProcess.getFunctionalArea())
                            .industryType(previousProcess.getIndustryType())
                            .functionalSubArea(previousProcess.getFunctionalSubArea())
                            .platform(platform)
                            // .key(request.getKey())
                            .build())
                    .collect(Collectors.toList());

            log.info("Created {} platform records", platforms.size());
            platforms.forEach(p -> log.info("Platform: {}", p.getPlatform()));
            
            // Save all platforms
            List<UserPlatform> savedPlatforms = userPlatformRepository.saveAll(platforms);
            
            log.info("Successfully saved {} platform selections for user: {} session: {}", 
                    savedPlatforms.size(), userId, sessionId);
            
            return SolutionSelectionResponse.success(
                    "Solutions saved successfully",
                    savedPlatforms.size()
            );
            
        } catch (Exception e) {
            log.error("Error saving solution selection for user: {} session: {}", 
                    userId, sessionId, e);
            throw new RuntimeException("Failed to save solution selection", e);
        }
    }
    
    public List<UserPlatform> getUserPlatforms(String userId, String sessionId) {
        log.info("Retrieving platforms for user: {} session: {}", userId, sessionId);
        
        List<UserPlatform> platforms = userPlatformRepository.findByUserIdAndSessionId(userId, sessionId);
        
        log.info("Retrieved {} platforms for user: {} session: {}", platforms.size(), userId, sessionId);
        
        return platforms;
    }
    
    public List<UserPlatform> getAllUserPlatforms(String userId) {
        log.info("Retrieving all platforms for user: {}", userId);
        
        List<UserPlatform> platforms = userPlatformRepository.findByUserId(userId);
        
        log.info("Retrieved {} total platforms for user: {}", platforms.size(), userId);
        
        return platforms;
    }
    
    public void clearUserSelection(String userId, String sessionId) {
        log.info("Clearing selection for user: {} session: {}", userId, sessionId);
        
        userPlatformRepository.deleteByUserIdAndSessionId(userId, sessionId);
        
        log.info("Successfully cleared platforms for user: {} session: {}", userId, sessionId);
    }

     public List<UserPlatform> getAllSolutions() {
        log.info("Retrieving all solutions from database");
        
        List<UserPlatform> allSolutions = userPlatformRepository.findAll();
        
        log.info("Retrieved {} total solutions from database", allSolutions.size());
        
        return allSolutions;
    }   
}
