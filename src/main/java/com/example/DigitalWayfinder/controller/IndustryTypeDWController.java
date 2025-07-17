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
import com.example.DigitalWayfinder.dto.SubFunctionalAreaRequestDTO;
import com.example.DigitalWayfinder.dto.SubFunctionalAreaResponseDTO;
import com.example.DigitalWayfinder.dto.UserSession;
import com.example.DigitalWayfinder.service.IndustryTypeDWService;
import com.example.DigitalWayfinder.service.SubFunctionalAreaDWService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/digital-wayfinder/industry-type")
@Slf4j
@Service
@RequiredArgsConstructor
@Tag(name = "Digital Wayfinder", description = "APIs for managing digital wayfinder industry type selection")
public class IndustryTypeDWController {
    
    private final IndustryTypeDWService industryTypeService;
    private final SubFunctionalAreaDWService subFunctionalAreaService;

    
    @PostMapping("/supply-chain-planning/save")
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
    
    @GetMapping("/supply-chain-planning/get")
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

    @PostMapping("/supply-chain-fulfillment/save")
    @Operation(summary = "Save or update industry type", 
               description = "Saves or updates sub functional area for the user session. Creates new record if doesn't exist, updates if exists.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Sub Functional Area saved/updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input parameters"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<SubFunctionalAreaResponseDTO> saveSubFunctionalArea(
            @Valid @RequestBody SubFunctionalAreaRequestDTO request,
            @ModelAttribute UserSession userSession) {
        
        try {
            log.info("Received request to save sun functional area: {} for user: {} in session: {}",
                    request.getFunctionalSubArea(), userSession.getUserId(), userSession.getSessionId());
            
            SubFunctionalAreaResponseDTO response = subFunctionalAreaService.saveOrUpdatefunctionalSubArea(
                    request, userSession.getUserId(), userSession.getSessionId());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error processing save industry type request", e);
            throw e;
        }
    }
    
    @GetMapping("/supply-chain-fulfillment/get")
    @Operation(summary = "Get Sub functional area", 
               description = "Retrieves the sub functional area for the current user session")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Sub functional area retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Sub functional area not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<SubFunctionalAreaResponseDTO> getSubFunctionalArea(
            @ModelAttribute UserSession userSession) {
        
        try {
            log.info("Received request to get sub functional area for user: {} in session: {}",
                    userSession.getUserId(), userSession.getSessionId());
            
            SubFunctionalAreaResponseDTO response = subFunctionalAreaService.getFunctionalSubArea(
                    userSession.getUserId(), userSession.getSessionId());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error processing get sub functional area request", e);
            throw e;
        }
    }
}