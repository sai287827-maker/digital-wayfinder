package com.example.DigitalWayfinder.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.example.DigitalWayfinder.dto.IndustryTypeRequestDTO;
import com.example.DigitalWayfinder.dto.IndustryTypeResponseDTO;
import com.example.DigitalWayfinder.entity.FunctionalAreaDW;
import com.example.DigitalWayfinder.repository.FunctionalAreaDWRepository;

import jakarta.transaction.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class IndustryTypeDWService {

     private final FunctionalAreaDWRepository functionalAreaRepository;
    
    @Transactional
    public IndustryTypeResponseDTO saveOrUpdateIndustryType(IndustryTypeRequestDTO request, String userId, String sessionId) {
        log.info("Processing industry type: {} for user: {} in session: {}", 
                request.getIndustryType(), userId, sessionId);
        
        try {
            // Check if record already exists for this user and session
            var existingRecord = functionalAreaRepository.findByUserIdAndSessionId(userId, sessionId);
            
            if (existingRecord.isPresent()) {
                FunctionalAreaDW functionalArea = existingRecord.get();
                
                // Check if functional area exists (must exist from previous save functional area page)
                if (functionalArea.getFunctionalArea() == null || functionalArea.getFunctionalArea().trim().isEmpty()) {
                    log.error("Functional area not found for user: {} in session: {}. User must complete functional area selection first.", 
                            userId, sessionId);
                    throw new IllegalStateException("Functional area must be selected before choosing industry type. Please complete the functional area selection first.");
                }
                
                // Update industry type for existing record (handles both cases: with or without existing industry type)
                log.info("Updating industry type for existing functional area: {} for user: {} in session: {}", 
                        functionalArea.getFunctionalArea(), userId, sessionId);
                return updateExistingRecord(functionalArea, request.getIndustryType());
                
            } else {
                // No record exists for this user and session - throw error
                log.error("No functional area record found for user: {} in session: {}. User must complete functional area selection first.", 
                    userId, sessionId);
                throw new IllegalStateException("No functional area found for user: " + userId + 
                    " in session: " + sessionId + ". Please complete the functional area selection first.");
                }
            
        } catch (Exception e) {
            log.error("Error processing industry type: {} for user: {} in session: {}", 
                    request.getIndustryType(), userId, sessionId, e);
            throw e;
        }
    }
    
    private IndustryTypeResponseDTO updateExistingRecord(FunctionalAreaDW functionalArea, String industryType) {
        log.info("Updating existing functional area ID: {} with industry type: {}", 
                functionalArea.getId(), industryType);
        
        // Check if industry type is being updated or set for the first time
        if (functionalArea.getIndustryType() != null && !functionalArea.getIndustryType().trim().isEmpty()) {
            log.info("Updating existing industry type from '{}' to '{}' for functional area ID: {}", 
                    functionalArea.getIndustryType(), industryType, functionalArea.getId());
        } else {
            log.info("Setting industry type for the first time for functional area ID: {}", 
                    functionalArea.getId());
        }
        
        // Update with new industry type (don't change functional area as it was set in previous step)
        functionalArea.setIndustryType(industryType);
        
        FunctionalAreaDW savedFunctionalArea = functionalAreaRepository.save(functionalArea);
        
        log.info("Successfully updated functional area ID: {} with industry type: {}", 
                savedFunctionalArea.getId(), industryType);
        
        return IndustryTypeResponseDTO.builder()
                .id(savedFunctionalArea.getId())
                .userId(savedFunctionalArea.getUserId())
                .sessionId(savedFunctionalArea.getSessionId())
                .functionalArea(savedFunctionalArea.getFunctionalArea())
                .industryType(savedFunctionalArea.getIndustryType())
                .message("Industry type updated successfully")
                .build();
    }

        public IndustryTypeResponseDTO getIndustryType(String userId, String sessionId) {
        log.info("Retrieving industry type for user: {} in session: {}", userId, sessionId);
        
        try {
            FunctionalAreaDW functionalArea = functionalAreaRepository
                 .findByUserIdAndSessionId(userId, sessionId)
                 .orElseThrow(() -> new IllegalStateException(
                         "Functional area not found for user: " + userId + " in session: " + sessionId));

            return mapToResponseDTO(functionalArea);
        } catch (Exception e) {
            log.error("Error retrieving industry type for user: {} in session: {}", userId, sessionId, e);
            throw e;
        }
    }

        private IndustryTypeResponseDTO mapToResponseDTO(FunctionalAreaDW functionalArea) {
        return IndustryTypeResponseDTO.builder()
                .id(functionalArea.getId())
                .userId(functionalArea.getUserId())
                .sessionId(functionalArea.getSessionId())
                .functionalArea(functionalArea.getFunctionalArea())
                .industryType(functionalArea.getIndustryType())
                .build();
    }

    }