package com.example.DigitalWayfinder.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.DigitalWayfinder.dto.IndustryTypeRequestDTO;
import com.example.DigitalWayfinder.dto.IndustryTypeResponseDTO;
import com.example.DigitalWayfinder.dto.UserSession;
import com.example.DigitalWayfinder.service.IndustryTypeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/digital-wayfinder/functional-area/industry-type")
@Slf4j
@Service
@RequiredArgsConstructor
@Tag(name = "Digital Wayfinder", description = "APIs for managing digital wayfinder industry type selection")
public class IndustryTypeController {
    
    private final IndustryTypeService industryTypeService;
    
    @PostMapping("/save")
    @Operation(summary = "Save or update industry type", 
               description = "Saves or updates industry type for the user session. Creates new record if doesn't exist, updates if exists.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Industry type saved/updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input parameters"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<IndustryTypeResponseDTO> saveIndustryType(
            @Valid @RequestBody IndustryTypeRequestDTO request,
            @ModelAttribute UserSession userSession) {
        
        try {
            log.info("Received request to save industry type: {} for user: {} in session: {}",
                    request.getIndustryType(), userSession.getUserId(), userSession.getSessionId());
            
            IndustryTypeResponseDTO response = industryTypeService.saveOrUpdateIndustryType(
                    request, userSession.getUserId(), userSession.getSessionId());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error processing save industry type request", e);
            throw e;
        }
    }
    
    @GetMapping("/get")
    @Operation(summary = "Get industry type", 
               description = "Retrieves the industry type for the current user session")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Industry type retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Industry type not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<IndustryTypeResponseDTO> getIndustryType(
            @ModelAttribute UserSession userSession) {
        
        try {
            log.info("Received request to get industry type for user: {} in session: {}",
                    userSession.getUserId(), userSession.getSessionId());
            
            IndustryTypeResponseDTO response = industryTypeService.getIndustryType(
                    userSession.getUserId(), userSession.getSessionId());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error processing get industry type request", e);
            throw e;
        }
    }
}