package com.example.DigitalWayfinder.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.DigitalWayfinder.dto.NonFunctionalScopeDto;
import com.example.DigitalWayfinder.service.NonFunctionalScopeService;

import java.util.List;

@RestController
@RequestMapping("api/decision-tree/non-functional-scope")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class NonFunctionalScopeController {
    
    private final NonFunctionalScopeService nonfunctionalScopeService;
    
    @GetMapping("/wms/all")
    public ResponseEntity<List<NonFunctionalScopeDto>> getAllFunctionalScopesWMS() {
        log.info("Received request to fetch all functional scopes");
        try {
            List<NonFunctionalScopeDto> nonfunctionalScopes = nonfunctionalScopeService.getAllFunctionalScopesWMS();
            log.info("Successfully returning {} non-functional scope records", nonfunctionalScopes.size());
            return ResponseEntity.ok(nonfunctionalScopes);
        } catch (Exception e) {
            log.error("Error in getAllFunctionalScopes: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/tms/all")
    public ResponseEntity<List<NonFunctionalScopeDto>> getAllFunctionalScopesTMS() {
        log.info("Received request to fetch all functional scopes");
        try {
            List<NonFunctionalScopeDto> nonfunctionalScopes = nonfunctionalScopeService.getAllFunctionalScopesTMS();
            log.info("Successfully returning {} functional scope records", nonfunctionalScopes.size());
            return ResponseEntity.ok(nonfunctionalScopes);
        } catch (Exception e) {
            log.error("Error in getAllFunctionalScopes: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/oms/all")
    public ResponseEntity<List<NonFunctionalScopeDto>> getAllFunctionalScopesOMS() {
        log.info("Received request to fetch all functional scopes");
        try {
            List<NonFunctionalScopeDto> nonfunctionalScopes = nonfunctionalScopeService.getAllFunctionalScopesOMS();
            log.info("Successfully returning {} functional scope records", nonfunctionalScopes.size());
            return ResponseEntity.ok(nonfunctionalScopes);
        } catch (Exception e) {
            log.error("Error in getAllFunctionalScopes: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/ind-agnoustic/all")
    public ResponseEntity<List<NonFunctionalScopeDto>> getAllFunctionalScopesIndAgnoustic() {
        log.info("Received request to fetch all functional scopes");
        try {
            List<NonFunctionalScopeDto> nonfunctionalScopes = nonfunctionalScopeService.getAllFunctionalScopesIndAgnoustic();
            log.info("Successfully returning {} functional scope records", nonfunctionalScopes.size());
            return ResponseEntity.ok(nonfunctionalScopes);
        } catch (Exception e) {
            log.error("Error in getAllFunctionalScopes: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/retail/all")
    public ResponseEntity<List<NonFunctionalScopeDto>> getAllFunctionalScopesRetail() {
        log.info("Received request to fetch all functional scopes");
        try {
            List<NonFunctionalScopeDto> nonfunctionalScopes = nonfunctionalScopeService.getAllFunctionalScopesRetail();
            log.info("Successfully returning {} functional scope records", nonfunctionalScopes.size());
            return ResponseEntity.ok(nonfunctionalScopes);
        } catch (Exception e) {
            log.error("Error in getAllFunctionalScopes: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/cgs/all")
    public ResponseEntity<List<NonFunctionalScopeDto>> getAllFunctionalScopesCGS() {
        log.info("Received request to fetch all functional scopes");
        try {
            List<NonFunctionalScopeDto> nonfunctionalScopes = nonfunctionalScopeService.getAllFunctionalScopesCGS();
            log.info("Successfully returning {} functional scope records", nonfunctionalScopes.size());
            return ResponseEntity.ok(nonfunctionalScopes);
        } catch (Exception e) {
            log.error("Error in getAllFunctionalScopes: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

//     @GetMapping("/all/{industryType}")
//     public ResponseEntity<List<FunctionalScopeDto>> getAllFunctionalScopesByIndustryType(
//         @PathVariable("industryType") String industryType) {
//     log.info("Received request to fetch all functional scopes for industry type: {}", industryType);
    
//     try {
//         // Validate industry type parameter
//         if (industryType == null || industryType.trim().isEmpty()) {
//             log.warn("Industry type parameter is null or empty");
//             return ResponseEntity.badRequest().build();
//         }
        
//         List<FunctionalScopeDto> functionalScopes = functionalScopeService
//             .getAllFunctionalScopesByIndustryType(industryType.trim());
        
//         log.info("Successfully returning {} functional scope records for industry type: {}", 
//             functionalScopes.size(), industryType);
        
//         return ResponseEntity.ok(functionalScopes);
        
//     } catch (IllegalArgumentException e) {
//         log.error("Invalid industry type provided: {}", industryType, e);
//         return ResponseEntity.badRequest().build();
//     } catch (Exception e) {
//         log.error("Error in getAllFunctionalScopesByIndustryType for industry type {}: {}", 
//             industryType, e.getMessage(), e);
//         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//     }
// }

//     @GetMapping("/tms/all")
//     public ResponseEntity<List<FunctionalScopeDto>> getAllFunctionalScopes() {
//         log.info("Received request to fetch all functional scopes");
//         try {
//             List<FunctionalScopeDto> functionalScopes = functionalScopeService.getAllFunctionalScopes();
//             log.info("Successfully returning {} functional scope records", functionalScopes.size());
//             return ResponseEntity.ok(functionalScopes);
//         } catch (Exception e) {
//             log.error("Error in getAllFunctionalScopes: {}", e.getMessage(), e);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//         }
//     }

//     @GetMapping("/oms/all")
//     public ResponseEntity<List<FunctionalScopeDto>> getAllFunctionalScopes() {
//         log.info("Received request to fetch all functional scopes");
//         try {
//             List<FunctionalScopeDto> functionalScopes = functionalScopeService.getAllFunctionalScopes();
//             log.info("Successfully returning {} functional scope records", functionalScopes.size());
//             return ResponseEntity.ok(functionalScopes);
//         } catch (Exception e) {
//             log.error("Error in getAllFunctionalScopes: {}", e.getMessage(), e);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//         }
//     }

//     @GetMapping("/ind-agnoustic/all")
//     public ResponseEntity<List<FunctionalScopeDto>> getAllFunctionalScopes() {
//         log.info("Received request to fetch all functional scopes");
//         try {
//             List<FunctionalScopeDto> functionalScopes = functionalScopeService.getAllFunctionalScopes();
//             log.info("Successfully returning {} functional scope records", functionalScopes.size());
//             return ResponseEntity.ok(functionalScopes);
//         } catch (Exception e) {
//             log.error("Error in getAllFunctionalScopes: {}", e.getMessage(), e);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//         }
//     }

//     @GetMapping("/retail/all")
//     public ResponseEntity<List<FunctionalScopeDto>> getAllFunctionalScopes() {
//         log.info("Received request to fetch all functional scopes");
//         try {
//             List<FunctionalScopeDto> functionalScopes = functionalScopeService.getAllFunctionalScopes();
//             log.info("Successfully returning {} functional scope records", functionalScopes.size());
//             return ResponseEntity.ok(functionalScopes);
//         } catch (Exception e) {
//             log.error("Error in getAllFunctionalScopes: {}", e.getMessage(), e);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//         }
//     }

//     @GetMapping("/cgs/all")
//     public ResponseEntity<List<FunctionalScopeDto>> getAllFunctionalScopes() {
//         log.info("Received request to fetch all functional scopes");
//         try {
//             List<FunctionalScopeDto> functionalScopes = functionalScopeService.getAllFunctionalScopes();
//             log.info("Successfully returning {} functional scope records", functionalScopes.size());
//             return ResponseEntity.ok(functionalScopes);
//         } catch (Exception e) {
//             log.error("Error in getAllFunctionalScopes: {}", e.getMessage(), e);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//         }
//     }

//     // @GetMapping("/level1")
//     // public ResponseEntity<Map<String, Object>> getLevel1Options() {
//     //     try {
//     //         log.info("REST request to get Level 1 options");
//     //         List<String> options = functionalScopeService.getLevel1Options();
            
//     //         Map<String, Object> response = new HashMap<>();
//     //         response.put("success", true);
//     //         response.put("data", options);
//     //         response.put("message", "Level 1 options retrieved successfully");
            
//     //         return ResponseEntity.ok(response);
//     //     } catch (Exception e) {
//     //         log.error("Error fetching Level 1 options: {}", e.getMessage(), e);
//     //         return createErrorResponse("Failed to fetch Level 1 options", HttpStatus.INTERNAL_SERVER_ERROR);
//     //     }
//     // }
    
//     // @GetMapping("/level2/{l1}")
//     // public ResponseEntity<Map<String, Object>> getLevel2Options(@PathVariable String l1) {
//     //     try {
//     //         log.info("REST request to get Level 2 options for L1: {}", l1);
            
//     //         if (l1 == null || l1.trim().isEmpty()) {
//     //             return createErrorResponse("L1 parameter cannot be empty", HttpStatus.BAD_REQUEST);
//     //         }
            
//     //         List<String> options = functionalScopeService.getLevel2Options(l1);
            
//     //         Map<String, Object> response = new HashMap<>();
//     //         response.put("success", true);
//     //         response.put("data", options);
//     //         response.put("message", "Level 2 options retrieved successfully");
//     //         response.put("parent", l1);
            
//     //         return ResponseEntity.ok(response);
//     //     } catch (Exception e) {
//     //         log.error("Error fetching Level 2 options for L1 {}: {}", l1, e.getMessage(), e);
//     //         return createErrorResponse("Failed to fetch Level 2 options", HttpStatus.INTERNAL_SERVER_ERROR);
//     //     }
//     // }
    
//     // @GetMapping("/level3/{l1}/{l2}")
//     // public ResponseEntity<Map<String, Object>> getLevel3Options(
//     //         @PathVariable String l1, 
//     //         @PathVariable String l2) {
//     //     try {
//     //         log.info("REST request to get Level 3 options for L1: {}, L2: {}", l1, l2);
            
//     //         if (l1 == null || l1.trim().isEmpty() || l2 == null || l2.trim().isEmpty()) {
//     //             return createErrorResponse("L1 and L2 parameters cannot be empty", HttpStatus.BAD_REQUEST);
//     //         }
            
//     //         List<String> options = functionalScopeService.getLevel3Options(l1, l2);
            
//     //         Map<String, Object> response = new HashMap<>();
//     //         response.put("success", true);
//     //         response.put("data", options);
//     //         response.put("message", "Level 3 options retrieved successfully");
//     //         response.put("parentL1", l1);
//     //         response.put("parentL2", l2);
            
//     //         return ResponseEntity.ok(response);
//     //     } catch (Exception e) {
//     //         log.error("Error fetching Level 3 options for L1 {}, L2 {}: {}", l1, l2, e.getMessage(), e);
//     //         return createErrorResponse("Failed to fetch Level 3 options", HttpStatus.INTERNAL_SERVER_ERROR);
//     //     }
//     // }
    
//     // @GetMapping("/level4/{l1}/{l2}/{l3}")
//     // public ResponseEntity<Map<String, Object>> getLevel4Options(
//     //         @PathVariable String l1, 
//     //         @PathVariable String l2, 
//     //         @PathVariable String l3) {
//     //     try {
//     //         log.info("REST request to get Level 4 options for L1: {}, L2: {}, L3: {}", l1, l2, l3);
            
//     //         if (l1 == null || l1.trim().isEmpty() || 
//     //             l2 == null || l2.trim().isEmpty() || 
//     //             l3 == null || l3.trim().isEmpty()) {
//     //             return createErrorResponse("L1, L2, and L3 parameters cannot be empty", HttpStatus.BAD_REQUEST);
//     //         }
            
//     //         List<String> options = functionalScopeService.getLevel4Options(l1, l2, l3);
            
//     //         Map<String, Object> response = new HashMap<>();
//     //         response.put("success", true);
//     //         response.put("data", options);
//     //         response.put("message", "Level 4 options retrieved successfully");
//     //         response.put("parentL1", l1);
//     //         response.put("parentL2", l2);
//     //         response.put("parentL3", l3);
            
//     //         return ResponseEntity.ok(response);
//     //     } catch (Exception e) {
//     //         log.error("Error fetching Level 4 options for L1 {}, L2 {}, L3 {}: {}", l1, l2, l3, e.getMessage(), e);
//     //         return createErrorResponse("Failed to fetch Level 4 options", HttpStatus.INTERNAL_SERVER_ERROR);
//     //     }
//     // }
    
//     // private ResponseEntity<Map<String, Object>> createErrorResponse(String message, HttpStatus status) {
//     //     Map<String, Object> errorResponse = new HashMap<>();
//     //     errorResponse.put("success", false);
//     //     errorResponse.put("message", message);
//     //     errorResponse.put("timestamp", System.currentTimeMillis());
//     //     return ResponseEntity.status(status).body(errorResponse);
//     // }
}
