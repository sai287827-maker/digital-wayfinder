package com.example.DigitalWayfinder.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.DigitalWayfinder.dto.FunctionalScopeDto;
import com.example.DigitalWayfinder.service.FunctionalScopeService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.example.DigitalWayfinder.dto.FunctionalScopeRequest;
import com.example.DigitalWayfinder.dto.FunctionalScopeResponse;
import com.example.DigitalWayfinder.dto.UserSession;
import jakarta.validation.Valid;

import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;


@RestController
@RequestMapping("api/decision-tree/functional-scope")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class FunctionalScopeController {
    
    private final FunctionalScopeService functionalScopeService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @GetMapping("/wms/all")
    public ResponseEntity<List<FunctionalScopeDto>> getAllFunctionalScopesWMS() {
        log.info("Received request to fetch all functional scopes");
        try {
            List<FunctionalScopeDto> functionalScopes = functionalScopeService.getAllFunctionalScopesWMS();
            log.info("Successfully returning {} functional scope records", functionalScopes.size());
            return ResponseEntity.ok(functionalScopes);
        } catch (Exception e) {
            log.error("Error in getAllFunctionalScopes: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/tms/all")
    public ResponseEntity<List<FunctionalScopeDto>> getAllFunctionalScopesTMS() {
        log.info("Received request to fetch all functional scopes");
        try {
            List<FunctionalScopeDto> functionalScopes = functionalScopeService.getAllFunctionalScopesTMS();
            log.info("Successfully returning {} functional scope records", functionalScopes.size());
            return ResponseEntity.ok(functionalScopes);
        } catch (Exception e) {
            log.error("Error in getAllFunctionalScopes: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/oms/all")
    public ResponseEntity<List<FunctionalScopeDto>> getAllFunctionalScopesOMS() {
        log.info("Received request to fetch all functional scopes");
        try {
            List<FunctionalScopeDto> functionalScopes = functionalScopeService.getAllFunctionalScopesOMS();
            log.info("Successfully returning {} functional scope records", functionalScopes.size());
            return ResponseEntity.ok(functionalScopes);
        } catch (Exception e) {
            log.error("Error in getAllFunctionalScopes: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/ind-agnoustic/all")
    public ResponseEntity<List<FunctionalScopeDto>> getAllFunctionalScopesIndAgnoustic() {
        log.info("Received request to fetch all functional scopes");
        try {
            List<FunctionalScopeDto> functionalScopes = functionalScopeService.getAllFunctionalScopesIndAgnoustic();
            log.info("Successfully returning {} functional scope records", functionalScopes.size());
            return ResponseEntity.ok(functionalScopes);
        } catch (Exception e) {
            log.error("Error in getAllFunctionalScopes: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/retail/all")
    public ResponseEntity<List<FunctionalScopeDto>> getAllFunctionalScopesRetail() {
        log.info("Received request to fetch all functional scopes");
        try {
            List<FunctionalScopeDto> functionalScopes = functionalScopeService.getAllFunctionalScopesRetail();
            log.info("Successfully returning {} functional scope records", functionalScopes.size());
            return ResponseEntity.ok(functionalScopes);
        } catch (Exception e) {
            log.error("Error in getAllFunctionalScopes: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/cgs/all")
    public ResponseEntity<List<FunctionalScopeDto>> getAllFunctionalScopesCGS() {
        log.info("Received request to fetch all functional scopes");
        try {
            List<FunctionalScopeDto> functionalScopes = functionalScopeService.getAllFunctionalScopesCGS();
            log.info("Successfully returning {} functional scope records", functionalScopes.size());
            return ResponseEntity.ok(functionalScopes);
        } catch (Exception e) {
            log.error("Error in getAllFunctionalScopes: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/save")
    public ResponseEntity<FunctionalScopeResponse> saveFunctionalScope(
            @Valid @RequestBody FunctionalScopeRequest request,
            @ModelAttribute UserSession userSession) {
        
        log.info("Received functional scope save request for user: {} and session: {}", userSession.getUserId(), userSession.getSessionId());
            try {
        log.info("Request body received: {}", objectMapper.writeValueAsString(request));
    } catch (JsonProcessingException e) {
        log.error("Error processing request body to JSON: {}", e.getMessage(), e);
    }
        
        FunctionalScopeResponse response = functionalScopeService.saveFunctionalScope(request, userSession.getUserId(), userSession.getSessionId());
        
        log.info("Successfully saved functional scope for user: {} and session: {}", userSession.getUserId(), userSession.getSessionId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}