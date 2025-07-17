package com.example.DigitalWayfinder.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.DigitalWayfinder.dto.FunctionalAreaRequest;
import com.example.DigitalWayfinder.dto.FunctionalAreaResponse;
import com.example.DigitalWayfinder.entity.FunctionalAreaDT;
import com.example.DigitalWayfinder.repository.FunctionalAreaDTRepository;

import java.util.List;
import java.util.Optional;
@Service
@RequiredArgsConstructor
@Slf4j
public class FunctionalAreaDTService {
    
    private final FunctionalAreaDTRepository repository;
    
@Transactional
public FunctionalAreaResponse saveFunctionalArea(FunctionalAreaRequest request, 
                                                 String userId, String sessionId) {
    try {
        // Check if a record for the userId and sessionId already exists
        Optional<FunctionalAreaDT> existingList = repository.findByUserIdAndSessionId(userId, sessionId);

        FunctionalAreaDT saved;

        if (!existingList.isEmpty()) {
            // Update existing record: only functionalArea
            FunctionalAreaDT existing = existingList.get();
            existing.setFunctionalArea(request.getFunctionalArea());

            // Do not update industryType and functionalSubArea
            saved = repository.save(existing);

            log.info("Updated functionalArea for userId: {}, sessionId: {}", userId, sessionId);
            return buildResponse(saved, "Functional area updated successfully", true);
        } else {
            // Insert new record: only userId, sessionId, and functionalArea
            FunctionalAreaDT newEntry = FunctionalAreaDT.builder()
                    .userId(userId)
                    .sessionId(sessionId)
                    .functionalArea(request.getFunctionalArea())
                    .build();

            saved = repository.save(newEntry);

            log.info("Saved new functionalArea for userId: {}, sessionId: {}", userId, sessionId);
            return buildResponse(saved, "Functional area saved successfully", true);
        }

    } catch (Exception e) {
        log.error("Error saving functional area for userId: {}, sessionId: {}", userId, sessionId, e);
        return FunctionalAreaResponse.builder()
                .success(false)
                .message("Failed to save functional area: " + e.getMessage())
                .build();
    }
}
    
    public Optional<FunctionalAreaDT> getUserFunctionalAreas(String userId, String sessionId) {
        return repository.findByUserIdAndSessionId(userId, sessionId);
    }
    
    // New comprehensive GET methods
    public List<FunctionalAreaDT> getAllFunctionalAreas() {
        log.info("Fetching all functional areas");
        return repository.findAll();
    }
    
    private FunctionalAreaResponse buildResponse(FunctionalAreaDT saved, String message, boolean success) {
        return FunctionalAreaResponse.builder()
                .id(saved.getId())
                .userId(saved.getUserId())
                .sessionId(saved.getSessionId())
                .functionalArea(saved.getFunctionalArea())
                .industryType(saved.getIndustryType())
                .functionalSubArea(saved.getFunctionalSubArea())
                .message(message)
                .success(success)
                .build();
    }
    
}