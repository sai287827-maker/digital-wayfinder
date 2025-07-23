package com.example.DigitalWayfinder.controller;

import com.example.DigitalWayfinder.dto.PlatformSolutionDTO;
import com.example.DigitalWayfinder.service.PlatformSolutionService;
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
public class PlatformSolutionController {
    
    private final PlatformSolutionService platformSolutionService;
    
    @GetMapping("/all")
    public ResponseEntity<List<PlatformSolutionDTO>> getAllPlatformSolutions(
            @RequestParam(required = false) String functionalArea,
            @RequestParam(required = false) String industryType,
            @RequestParam(required = false) String functionalSubArea) {
        
        log.info("GET request received for platform solutions with filters");
        
        try {
            List<PlatformSolutionDTO> platforms;
            
            // If any filter is provided, use filtered search
            if (functionalArea != null || industryType != null || functionalSubArea != null) {
                platforms = platformSolutionService.getPlatformsWithFilters(functionalArea, industryType, functionalSubArea);
            } else {
                // Otherwise return all platforms
                platforms = platformSolutionService.getAllPlatforms();
            }
            
            if (platforms.isEmpty()) {
                log.info("No platform solutions found");
                return ResponseEntity.noContent().build();
            }
            
            log.info("Returning {} platform solutions", platforms.size());
            return ResponseEntity.ok(platforms);
            
        } catch (Exception e) {
            log.error("Error processing request for platform solutions: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/industry-type/{industryType}")
    public ResponseEntity<List<PlatformSolutionDTO>> getPlatformsByIndustryType(@PathVariable String industryType) {
        log.info("GET request received for platforms with industry type: {}", industryType);
        
        try {
            List<PlatformSolutionDTO> platforms = platformSolutionService.getPlatformsByIndustryType(industryType);
            
            if (platforms.isEmpty()) {
                log.info("No platforms found for industry type: {}", industryType);
                return ResponseEntity.noContent().build();
            }
            
            log.info("Returning {} platforms for industry type: {}", platforms.size(), industryType);
            return ResponseEntity.ok(platforms);
            
        } catch (Exception e) {
            log.error("Error processing request for industry type {}: {}", industryType, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}