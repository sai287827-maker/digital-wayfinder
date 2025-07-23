package com.example.DigitalWayfinder.controller;

import com.example.DigitalWayfinder.dto.SolutionSelectionRequest;
import com.example.DigitalWayfinder.dto.SolutionSelectionResponse;
import com.example.DigitalWayfinder.dto.UserSession;
import com.example.DigitalWayfinder.entity.UserPlatform;
import com.example.DigitalWayfinder.service.UserPlatformService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/decision-tree/functional-scope/solution")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class SolutionController {
    
    private final UserPlatformService userPlatformService;
    
    @PostMapping("/save")
    public ResponseEntity<SolutionSelectionResponse> saveSolutionSelection(
            @Valid @RequestBody SolutionSelectionRequest request, @ModelAttribute UserSession userSession) {
        
        log.info("POST /api/decision-tree/functional-scope/solution/save - Saving solution selection for user: {}", userSession.getUserId(), userSession.getSessionId());
        
        try {
            SolutionSelectionResponse response = userPlatformService.saveSolutionSelection(request,userSession.getUserId(), userSession.getSessionId());
            
            log.info("Successfully saved solution selection for user: {} - {} platforms saved", 
                    userSession.getUserId(), userSession.getSessionId(), response.getPlatformsSaved());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            log.error("Error saving solutions for user: {}", userSession.getUserId(), e);
            
            SolutionSelectionResponse errorResponse = SolutionSelectionResponse.builder()
                    .message("Error saving solutions: " + e.getMessage())
                    .platformsSaved(0)
                    .build();
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<UserPlatform>> getAllSolutions() {
        log.info("GET /api/v1/solutions/all - Retrieving all solutions");
        
        try {
            List<UserPlatform> allSolutions = userPlatformService.getAllSolutions();
            
            if (allSolutions.isEmpty()) {
                log.warn("No solutions found in database");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            
            log.info("Successfully retrieved {} solutions", allSolutions.size());
            
            return ResponseEntity.ok(allSolutions);
            
        } catch (Exception e) {
            log.error("Error retrieving all solutions", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/user/{userId}/session/{sessionId}")
    public ResponseEntity<List<UserPlatform>> getUserPlatforms(
            @PathVariable String userId,
            @PathVariable String sessionId) {
        
        log.info("GET /api/v1/solutions/user/{}/session/{} - Retrieving platforms", userId, sessionId);
        
        try {
            List<UserPlatform> platforms = userPlatformService.getUserPlatforms(userId, sessionId);
            
            if (platforms.isEmpty()) {
                log.warn("No platforms found for user: {} session: {}", userId, sessionId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            
            log.info("Successfully retrieved {} platforms for user: {} session: {}", 
                    platforms.size(), userId, sessionId);
            
            return ResponseEntity.ok(platforms);
            
        } catch (Exception e) {
            log.error("Error retrieving platforms for user: {} session: {}", userId, sessionId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserPlatform>> getAllUserPlatforms(@PathVariable String userId) {
        
        log.info("GET /api/v1/solutions/user/{} - Retrieving all platforms", userId);
        
        try {
            List<UserPlatform> platforms = userPlatformService.getAllUserPlatforms(userId);
            
            if (platforms.isEmpty()) {
                log.warn("No platforms found for user: {}", userId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            
            log.info("Successfully retrieved {} total platforms for user: {}", platforms.size(), userId);
            
            return ResponseEntity.ok(platforms);
            
        } catch (Exception e) {
            log.error("Error retrieving all platforms for user: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @DeleteMapping("/user/{userId}/session/{sessionId}")
    public ResponseEntity<String> clearUserSelection(
            @PathVariable String userId,
            @PathVariable String sessionId) {
        
        log.info("DELETE /api/v1/solutions/user/{}/session/{} - Clearing selection", userId, sessionId);
        
        try {
            userPlatformService.clearUserSelection(userId, sessionId);
            
            log.info("Successfully cleared selection for user: {} session: {}", userId, sessionId);
            
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("User selection cleared successfully");
            
        } catch (Exception e) {
            log.error("Error clearing selection for user: {} session: {}", userId, sessionId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error clearing selection: " + e.getMessage());
        }
    }
}
