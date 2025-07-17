package com.example.DigitalWayfinder.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.example.DigitalWayfinder.dto.FunctionalScopeRequest;
import com.example.DigitalWayfinder.dto.FunctionalScopeResponse;
import com.example.DigitalWayfinder.dto.NonFunctionalScopeDto;
import com.example.DigitalWayfinder.entity.FunctionalAreaDT;
import com.example.DigitalWayfinder.entity.UserNonFuncProcess;
import com.example.DigitalWayfinder.repository.CgsFunctionalRepository;
import com.example.DigitalWayfinder.repository.FunctionalAreaDTRepository;
import com.example.DigitalWayfinder.repository.IndAgnousticFunctionalRepository;
import com.example.DigitalWayfinder.repository.OmsFunctionalRepository;
import com.example.DigitalWayfinder.repository.RetailFunctionalRepository;
import com.example.DigitalWayfinder.repository.TmsFunctionalRepository;
import com.example.DigitalWayfinder.repository.UserNonFuncProcessRepository;
import com.example.DigitalWayfinder.repository.WmsNonFunctionalRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NonFunctionalScopeService {
    
    private final WmsNonFunctionalRepository wmsNonFunctionalRepository;
    private final TmsFunctionalRepository tmsFunctionalRepository;
    private final OmsFunctionalRepository omsFunctionalRepository;
    private final IndAgnousticFunctionalRepository indagnousticFunctionalRepository;
    private final RetailFunctionalRepository retailFunctionalRepository;
    private final CgsFunctionalRepository cgsFunctionalRepository;

    private final UserNonFuncProcessRepository functionalProcessRepository;
    private final ObjectMapper objectMapper;
    private final FunctionalAreaDTRepository functionalAreaDTRepository;
    
    public List<NonFunctionalScopeDto> getAllFunctionalScopesWMS() {
        log.info("Fetching all non-functional scope levels");
        try {
            List<Object[]> nonfunctionalScopes = wmsNonFunctionalRepository.findAllLevelsAsArray();
            log.info("Successfully fetched {} non-functional scope records", nonfunctionalScopes.size());
            
            return nonfunctionalScopes.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching non-functional scopes: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch non-functional scopes", e);
        }
    }

        public List<NonFunctionalScopeDto> getAllFunctionalScopesOMS() {
        log.info("Fetching all functional scope levels");
        try {
            List<Object[]> functionalScopes = omsFunctionalRepository.findAllLevelsAsArray();
            log.info("Successfully fetched {} functional scope records", functionalScopes.size());
            
            return functionalScopes.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching functional scopes: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch functional scopes", e);
        }
    }

        public List<NonFunctionalScopeDto> getAllFunctionalScopesTMS() {
        log.info("Fetching all functional scope levels");
        try {
            List<Object[]> functionalScopes = tmsFunctionalRepository.findAllLevelsAsArray();
            log.info("Successfully fetched {} functional scope records", functionalScopes.size());
            
            return functionalScopes.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching functional scopes: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch functional scopes", e);
        }
    }

        public List<NonFunctionalScopeDto> getAllFunctionalScopesIndAgnoustic() {
        log.info("Fetching all functional scope levels");
        try {
            List<Object[]> functionalScopes = indagnousticFunctionalRepository.findAllLevelsAsArray();
            log.info("Successfully fetched {} functional scope records", functionalScopes.size());
            
            return functionalScopes.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching functional scopes: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch functional scopes", e);
        }
    }

        public List<NonFunctionalScopeDto> getAllFunctionalScopesRetail() {
        log.info("Fetching all functional scope levels");
        try {
            List<Object[]> functionalScopes = retailFunctionalRepository.findAllLevelsAsArray();
            log.info("Successfully fetched {} functional scope records", functionalScopes.size());
            
            return functionalScopes.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching functional scopes: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch functional scopes", e);
        }
    }

        public List<NonFunctionalScopeDto> getAllFunctionalScopesCGS() {
        log.info("Fetching all functional scope levels");
        try {
            List<Object[]> functionalScopes = cgsFunctionalRepository.findAllLevelsAsArray();
            log.info("Successfully fetched {} functional scope records", functionalScopes.size());
            
            return functionalScopes.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching functional scopes: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch functional scopes", e);
        }
    }
    
    private NonFunctionalScopeDto convertToDto(Object[] row) {
        return new NonFunctionalScopeDto(
                (String) row[0],  // l1
                (String) row[1],  // l2
                (String) row[2] // l3
                // (String) row[3]   // l4
                // (String) row[4]   // l5
        );
    }

    public FunctionalScopeResponse saveFunctionalScope(FunctionalScopeRequest request, String userId, String sessionId) {
        log.info("Saving functional scope for user: {} and session: {}", userId, sessionId);
        
        try {
            Optional<UserNonFuncProcess> existingRecord = functionalProcessRepository
                    .findByUserIdAndSessionId(userId, sessionId);
            
            UserNonFuncProcess functionalProcess;
            
            if (existingRecord.isPresent()) {
                log.info("Updating existing functional scope record for user: {} and session: {}", userId, sessionId);
                functionalProcess = existingRecord.get();
                updateFunctionalProcess(functionalProcess, request);
            } else {
                log.info("Creating new functional scope record for user: {} and session: {}", userId, sessionId);
                functionalProcess = createFunctionalProcess(request, userId, sessionId);
            }
            
            UserNonFuncProcess savedProcess = functionalProcessRepository.save(functionalProcess);
            log.info("Successfully saved functional scope for user: {} and session: {}", userId, sessionId);
            
            return mapToFunctionalScopeResponse(savedProcess);
            
        } catch (Exception e) {
            log.error("Error saving functional scope for user: {} and session: {}", userId, sessionId, e);
            throw new RuntimeException("Failed to save functional scope: " + e.getMessage());
        }}

        private UserNonFuncProcess createFunctionalProcess(FunctionalScopeRequest request, String userId, String sessionId) {
            FunctionalAreaDT previousProcess = functionalAreaDTRepository
            .findByUserIdAndSessionId(userId, sessionId)
            .orElseThrow(() -> new RuntimeException("Previous functional process not found"));
        
            return UserNonFuncProcess.builder()
                .userId(userId)
                .sessionId(sessionId)
                .functionalArea(previousProcess.getFunctionalArea())
                .industryType(previousProcess.getIndustryType())
                .functionalSubArea(previousProcess.getFunctionalSubArea())
                .l1(listToJsonString(request.getLevelSelections() != null ? request.getLevelSelections().getL1() : null))
                .l2(listToJsonString(request.getLevelSelections() != null ? request.getLevelSelections().getL2() : null))
                .l3(listToJsonString(request.getLevelSelections() != null ? request.getLevelSelections().getL3() : null))
                .l4(listToJsonString(request.getLevelSelections() != null ? request.getLevelSelections().getL4() : null))
                .l5(listToJsonString(request.getLevelSelections() != null ? request.getLevelSelections().getL5() : null))
                .build();
    }
    
    private void updateFunctionalProcess(UserNonFuncProcess functionalProcess, FunctionalScopeRequest request) {
        functionalProcess.setFunctionalArea(request.getFunctionalArea());
        functionalProcess.setIndustryType(request.getIndustryType());
        functionalProcess.setFunctionalSubArea(request.getFunctionalSubArea());
        functionalProcess.setL1(listToJsonString(request.getLevelSelections() != null ? request.getLevelSelections().getL1() : null));
        functionalProcess.setL2(listToJsonString(request.getLevelSelections() != null ? request.getLevelSelections().getL2() : null));
        functionalProcess.setL3(listToJsonString(request.getLevelSelections() != null ? request.getLevelSelections().getL3() : null));
        functionalProcess.setL4(listToJsonString(request.getLevelSelections() != null ? request.getLevelSelections().getL4() : null));
        functionalProcess.setL5(listToJsonString(request.getLevelSelections() != null ? request.getLevelSelections().getL5() : null));
    }

    private String listToJsonString(List<String> list) {
        if (list == null || list.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(list);
        } catch (JsonProcessingException e) {
            log.error("Error converting list to JSON string", e);
            return null;
        }
    }
    
    private List<String> jsonStringToList(String jsonString) {
        if (jsonString == null || jsonString.trim().isEmpty()) {
            return Collections.emptyList();
        }
        try {
            return objectMapper.readValue(jsonString, 
                    objectMapper.getTypeFactory().constructCollectionType(List.class, String.class));
        } catch (JsonProcessingException e) {
            log.error("Error converting JSON string to list", e);
            return Collections.emptyList();
        }
    }
    
    private FunctionalScopeResponse mapToFunctionalScopeResponse(UserNonFuncProcess functionalProcess) {
        return FunctionalScopeResponse.builder()
                .userId(functionalProcess.getUserId())
                .sessionId(functionalProcess.getSessionId())
                .functionalArea(functionalProcess.getFunctionalArea())
                .industryType(functionalProcess.getIndustryType())
                .functionalSubArea(functionalProcess.getFunctionalSubArea())
                .levelSelections(FunctionalScopeResponse.LevelSelections.builder()
                        .l1(jsonStringToList(functionalProcess.getL1()))
                        .l2(jsonStringToList(functionalProcess.getL2()))
                        .l3(jsonStringToList(functionalProcess.getL3()))
                        .l4(jsonStringToList(functionalProcess.getL4()))
                        .l5(jsonStringToList(functionalProcess.getL5()))
                        .build())
                .build();
    }

    // public List<String> getLevel1Options() {
    //     log.info("Fetching Level 1 options");
    //     List<String> l1Options = wmsFunctionalRepository.findDistinctL1();
    //     log.info("Found {} Level 1 options", l1Options.size());
    //     return l1Options;
    // }
    
    // public List<String> getLevel2Options(String l1) {
    //     log.info("Fetching Level 2 options for L1: {}", l1);
    //     List<String> l2Options = wmsFunctionalRepository.findDistinctL2ByL1(l1);
    //     log.info("Found {} Level 2 options for L1: {}", l2Options.size(), l1);
    //     return l2Options;
    // }
    
    // public List<String> getLevel3Options(String l1, String l2) {
    //     log.info("Fetching Level 3 options for L1: {}, L2: {}", l1, l2);
    //     List<String> l3Options = wmsFunctionalRepository.findDistinctL3ByL1AndL2(l1, l2);
    //     log.info("Found {} Level 3 options for L1: {}, L2: {}", l3Options.size(), l1, l2);
    //     return l3Options;
    // }
    
    // public List<String> getLevel4Options(String l1, String l2, String l3) {
    //     log.info("Fetching Level 4 options for L1: {}, L2: {}, L3: {}", l1, l2, l3);
    //     List<String> l4Options = wmsFunctionalRepository.findDistinctL4ByL1AndL2AndL3(l1, l2, l3);
    //     log.info("Found {} Level 4 options for L1: {}, L2: {}, L3: {}", l4Options.size(), l1, l2, l3);
    //     return l4Options;
    // }
}