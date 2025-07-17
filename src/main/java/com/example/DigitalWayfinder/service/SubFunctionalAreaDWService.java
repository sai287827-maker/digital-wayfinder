package com.example.DigitalWayfinder.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.example.DigitalWayfinder.dto.SubFunctionalAreaRequestDTO;
import com.example.DigitalWayfinder.dto.SubFunctionalAreaResponseDTO;
import com.example.DigitalWayfinder.entity.FunctionalAreaDW;
import com.example.DigitalWayfinder.repository.FunctionalAreaDWRepository;

import jakarta.transaction.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubFunctionalAreaDWService {

     private final FunctionalAreaDWRepository functionalAreaRepository;
    
    @Transactional
    public SubFunctionalAreaResponseDTO saveOrUpdatefunctionalSubArea(SubFunctionalAreaRequestDTO request, String userId, String sessionId) {
        log.info("Processing sub functional area: {} for user: {} in session: {}", 
                request.getFunctionalSubArea(), userId, sessionId);
        
        try {
            // Check if record already exists for this user and session
            var existingRecord = functionalAreaRepository.findByUserIdAndSessionId(userId, sessionId);
            
            if (existingRecord.isPresent()) {
                FunctionalAreaDW functionalArea = existingRecord.get();
                
                // Check if functional area exists (must exist from previous save functional area page)
                if (functionalArea.getFunctionalArea() == null || functionalArea.getFunctionalArea().trim().isEmpty()) {
                    log.error("Functional area not found for user: {} in session: {}. User must complete functional area selection first.", 
                            userId, sessionId);
                    throw new IllegalStateException("Functional area must be selected before choosing sub functional area. Please complete the functional area selection first.");
                }
                
                // Update sub functional area for existing record (handles both cases: with or without existing sub functional area)
                log.info("Updating sub functional area for existing functional area: {} for user: {} in session: {}", 
                        functionalArea.getFunctionalArea(), userId, sessionId);
                return updateExistingRecord(functionalArea, request.getFunctionalSubArea());
                
            } else {
                // No record exists for this user and session - throw error
                log.error("No functional area record found for user: {} in session: {}. User must complete functional area selection first.", 
                    userId, sessionId);
                throw new IllegalStateException("No functional area found for user: " + userId + 
                    " in session: " + sessionId + ". Please complete the functional area selection first.");
                }
            
        } catch (Exception e) {
            log.error("Error processing sub functional area: {} for user: {} in session: {}", 
                    request.getFunctionalSubArea(), userId, sessionId, e);
            throw e;
        }
    }
    
    private SubFunctionalAreaResponseDTO updateExistingRecord(FunctionalAreaDW functionalArea, String functionalSubArea) {
        log.info("Updating existing functional area ID: {} with sub functional area: {}", 
                functionalArea.getId(), functionalSubArea);
        
        // Check if sub functional area is being updated or set for the first time
        if (functionalArea.getFunctionalSubArea() != null && !functionalArea.getFunctionalSubArea().trim().isEmpty()) {
            log.info("Updating existing sub functional area from '{}' to '{}' for functional area ID: {}", 
                    functionalArea.getFunctionalSubArea(), functionalSubArea, functionalArea.getId());
        } else {
            log.info("Setting sub functional area for the first time for functional area ID: {}", 
                    functionalArea.getId());
        }
        
        // Update with new sub functional area (don't change functional area as it was set in previous step)
        functionalArea.setFunctionalSubArea(functionalSubArea);
        
        FunctionalAreaDW savedFunctionalArea = functionalAreaRepository.save(functionalArea);
        
        log.info("Successfully updated functional area ID: {} with sub functional area: {}", 
                savedFunctionalArea.getId(), functionalSubArea);
        
        return SubFunctionalAreaResponseDTO.builder()
                .id(savedFunctionalArea.getId())
                .userId(savedFunctionalArea.getUserId())
                .sessionId(savedFunctionalArea.getSessionId())
                .functionalArea(savedFunctionalArea.getFunctionalArea())
                .functionalSubArea(savedFunctionalArea.getFunctionalSubArea())
                .message("sub functional area updated successfully")
                .build();
    }

        public SubFunctionalAreaResponseDTO getFunctionalSubArea(String userId, String sessionId) {
        log.info("Retrieving sub functional area for user: {} in session: {}", userId, sessionId);
        
        try {
            FunctionalAreaDW functionalArea = functionalAreaRepository
                 .findByUserIdAndSessionId(userId, sessionId)
                 .orElseThrow(() -> new IllegalStateException(
                         "Functional area not found for user: " + userId + " in session: " + sessionId));

            return mapToResponseDTO(functionalArea);
        } catch (Exception e) {
            log.error("Error retrieving sub functional area for user: {} in session: {}", userId, sessionId, e);
            throw e;
        }
    }

        private SubFunctionalAreaResponseDTO mapToResponseDTO(FunctionalAreaDW functionalArea) {
        return SubFunctionalAreaResponseDTO.builder()
                .id(functionalArea.getId())
                .userId(functionalArea.getUserId())
                .sessionId(functionalArea.getSessionId())
                .functionalArea(functionalArea.getFunctionalArea())
                .functionalSubArea(functionalArea.getFunctionalSubArea())
                .build();
    }

    }