package com.example.DigitalWayfinder.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.DigitalWayfinder.dto.NonFunctionalRequest;
import com.example.DigitalWayfinder.dto.NonFunctionalResponse;
import com.example.DigitalWayfinder.dto.NonFunctionalScopeDto;
import com.example.DigitalWayfinder.entity.FunctionalAreaDT;
import com.example.DigitalWayfinder.entity.UserNonFuncProcess;
import com.example.DigitalWayfinder.repository.CgsNonFunctionalRepository;
import com.example.DigitalWayfinder.repository.FunctionalAreaDTRepository;
import com.example.DigitalWayfinder.repository.IndAgnousticNonFunctionalRepository;
import com.example.DigitalWayfinder.repository.RetailNonFunctionalRepository;
import com.example.DigitalWayfinder.repository.TmsNonFunctionalRepository;
import com.example.DigitalWayfinder.repository.UserNonFuncProcessRepository;
import com.example.DigitalWayfinder.repository.WmsNonFunctionalRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
@Slf4j
public class NonFunctionalScopeService {
    
    private final WmsNonFunctionalRepository wmsNonFunctionalRepository;
    private final TmsNonFunctionalRepository tmsNonFunctionalRepository;
    private final IndAgnousticNonFunctionalRepository indagnousticNonFunctionalRepository;
    private final RetailNonFunctionalRepository retailNonFunctionalRepository;
    private final CgsNonFunctionalRepository cgsNonFunctionalRepository;

    private final UserNonFuncProcessRepository nonfunctionalProcessRepository;
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

    public List<NonFunctionalScopeDto> getAllFunctionalScopesTMS() {
        log.info("Fetching all non-functional scope levels");
        try {
            List<Object[]> nonfunctionalScopes = tmsNonFunctionalRepository.findAllLevelsAsArray();
            log.info("Successfully fetched {} non-functional scope records", nonfunctionalScopes.size());
            
            return nonfunctionalScopes.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching non-functional scopes: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch non-functional scopes", e);
        }
    }

    public List<NonFunctionalScopeDto> getAllFunctionalScopesIndAgnoustic() {
        log.info("Fetching all non-functional scope levels");
        try {
            List<Object[]> nonfunctionalScopes = indagnousticNonFunctionalRepository.findAllLevelsAsArray();
            log.info("Successfully fetched {} non-functional scope records", nonfunctionalScopes.size());
            
            return nonfunctionalScopes.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching non-functional scopes: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch non-functional scopes", e);
        }
    }

    public List<NonFunctionalScopeDto> getAllFunctionalScopesRetail() {
        log.info("Fetching all non-functional scope levels");
        try {
            List<Object[]> nonfunctionalScopes = retailNonFunctionalRepository.findAllLevelsAsArray();
            log.info("Successfully fetched {} non-functional scope records", nonfunctionalScopes.size());
            
            return nonfunctionalScopes.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching non-functional scopes: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch non-functional scopes", e);
        }
    }

    public List<NonFunctionalScopeDto> getAllFunctionalScopesCGS() {
        log.info("Fetching all non-functional scope levels");
        try {
            List<Object[]> nonfunctionalScopes = cgsNonFunctionalRepository.findAllLevelsAsArray();
            log.info("Successfully fetched {} non-functional scope records", nonfunctionalScopes.size());
            
            return nonfunctionalScopes.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching non-functional scopes: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch non-functional scopes", e);
        }
    }
    
    private NonFunctionalScopeDto convertToDto(Object[] row) {
        return new NonFunctionalScopeDto(
                (String) row[0],  // l1
                (String) row[1],  // l2
                (String) row[2]   // l3
        );
    }

    @Transactional
    public NonFunctionalResponse saveNonFunctionalScope(NonFunctionalRequest request, String userId, String sessionId) {
        log.info("Saving non-functional scope for user: {} and session: {}", userId, sessionId);
        
        try {
            // First, delete all existing records for this user/session
            nonfunctionalProcessRepository.deleteByUserIdAndSessionId(userId, sessionId);
            
            // Get the functional area info from previous step
            FunctionalAreaDT previousProcess = functionalAreaDTRepository
                .findByUserIdAndSessionId(userId, sessionId)
                .orElseThrow(() -> new RuntimeException("Previous functional process not found"));
            
            List<UserNonFuncProcess> recordsToSave = new ArrayList<>();
            
            NonFunctionalRequest.LevelSelections levelSelections = request.getLevelSelections();
            
            if (levelSelections != null) {
                List<UserNonFuncProcess> records = convertToMultipleRecords(
                    levelSelections, userId, sessionId, previousProcess);
                recordsToSave.addAll(records);
            }
            
            // Save all records at once
            List<UserNonFuncProcess> savedRecords = nonfunctionalProcessRepository.saveAll(recordsToSave);
            
            log.info("Successfully saved {} non-functional scope records", savedRecords.size());
            return mapToNonFunctionalScopeResponse(savedRecords, previousProcess);
            
        } catch (Exception e) {
            log.error("Error saving non-functional scope for user: {} and session: {}", userId, sessionId, e);
            throw new RuntimeException("Failed to save non-functional scope: " + e.getMessage());
        }
    }

    private List<UserNonFuncProcess> convertToMultipleRecords(
            NonFunctionalRequest.LevelSelections levelSelections,
            String userId, String sessionId, FunctionalAreaDT previousProcess) {
        
        List<UserNonFuncProcess> records = new ArrayList<>();
        Set<String> processedPaths = new HashSet<>();
        
        List<String> l1List = levelSelections.getL1() != null ? levelSelections.getL1() : new ArrayList<>();
        List<String> l2List = levelSelections.getL2() != null ? levelSelections.getL2() : new ArrayList<>();
        List<String> l3List = levelSelections.getL3() != null ? levelSelections.getL3() : new ArrayList<>();

        log.info("L1 selections: {}", l1List);
        log.info("L2 selections: {}", l2List);
        log.info("L3 selections: {}", l3List);
        
        String functionalArea = previousProcess.getFunctionalArea();
        log.info("Functional area from previousProcess: {}", functionalArea);

        
        log.info("Processing non-functional selections - L1: {}, L2: {}, L3: {}", 
                 l1List.size(), l2List.size(), l3List.size());
        
        // 1. Process explicitly selected L3s first
        for (String l3 : l3List) {
            Optional<Object[]> pathOpt = getFirstPathForL3(l3, functionalArea);
            if (pathOpt.isPresent()) {
                Object[] path = pathOpt.get();
                String pathKey = createPathKey(path);
                if (!processedPaths.contains(pathKey)) {
                    records.add(createRecord(path, userId, sessionId, previousProcess));
                    processedPaths.add(pathKey);
                    log.info("Added explicitly selected L3: {}", l3);
                }
            }
        }
        
        // 2. Process L2 selections
        for (String l2 : l2List) {
            // Find all L3s under this L2
            List<String> l3sUnderThisL2 = findAllL3ByL2(l2, functionalArea);
            List<String> selectedL3sUnderThisL2 = l3sUnderThisL2.stream()
                    .filter(l3List::contains)
                    .collect(Collectors.toList());
            
            if (selectedL3sUnderThisL2.isEmpty()) {
                // No L3s selected under this L2 → auto-expand all L3s
                log.info("No L3s selected under L2 '{}', auto-expanding all L3s", l2);
                for (String l3 : l3sUnderThisL2) {
                    Optional<Object[]> pathOpt = getFirstPathForL3(l3, functionalArea);
                    if (pathOpt.isPresent()) {
                        Object[] path = pathOpt.get();
                        String pathKey = createPathKey(path);
                        if (!processedPaths.contains(pathKey)) {
                            records.add(createRecord(path, userId, sessionId, previousProcess));
                            processedPaths.add(pathKey);
                            log.info("Auto-expanded L3 under L2 '{}': {}", l2, l3);
                        }
                    }
                }
                
                // If no L3s exist under this L2, save the L2 itself
                if (l3sUnderThisL2.isEmpty()) {
                    Optional<Object[]> pathOpt = getFirstPathForL2(l2, functionalArea);
                    if (pathOpt.isPresent()) {
                        Object[] path = pathOpt.get();
                        String pathKey = createPathKey(path);
                        if (!processedPaths.contains(pathKey)) {
                            records.add(createRecordUpToL2(path, userId, sessionId, previousProcess));
                            processedPaths.add(pathKey);
                            log.info("Added L2 with no L3 children: {}", l2);
                        }
                    }
                }
            } else {
                log.info("L3s were explicitly selected under L2 '{}', skipping auto-expansion", l2);
                // L3s were explicitly selected under this L2, so don't auto-expand
                // The explicitly selected L3s were already processed above
            }
        }
        
        // 3. Process L1 selections
        for (String l1 : l1List) {
            // Find all L2s under this L1
            List<String> l2sUnderThisL1 = findAllL2ByL1(l1, functionalArea);
            List<String> selectedL2sUnderThisL1 = l2sUnderThisL1.stream()
                    .filter(l2List::contains)
                    .collect(Collectors.toList());
            
            if (selectedL2sUnderThisL1.isEmpty()) {
                // No L2s selected under this L1 → auto-expand everything
                log.info("No L2s selected under L1 '{}', auto-expanding all children", l1);
                for (String l2 : l2sUnderThisL1) {
                    List<String> l3sUnderThisL2 = findAllL3ByL2(l2, functionalArea);
                    for (String l3 : l3sUnderThisL2) {
                        Optional<Object[]> pathOpt = getFirstPathForL3(l3, functionalArea);
                        if (pathOpt.isPresent()) {
                            Object[] path = pathOpt.get();
                            String pathKey = createPathKey(path);
                            if (!processedPaths.contains(pathKey)) {
                                records.add(createRecord(path, userId, sessionId, previousProcess));
                                processedPaths.add(pathKey);
                                log.info("Auto-expanded L3 under L1 '{}' -> L2 '{}': {}", l1, l2, l3);
                            }
                        }
                    }
                    
                    if (l3sUnderThisL2.isEmpty()) {
                        Optional<Object[]> pathOpt = getFirstPathForL2(l2, functionalArea);
                        if (pathOpt.isPresent()) {
                            Object[] path = pathOpt.get();
                            String pathKey = createPathKey(path);
                            if (!processedPaths.contains(pathKey)) {
                                records.add(createRecordUpToL2(path, userId, sessionId, previousProcess));
                                processedPaths.add(pathKey);
                            }
                        }
                    }
                }
                
                if (l2sUnderThisL1.isEmpty()) {
                    String pathKey = l1;
                    if (!processedPaths.contains(pathKey)) {
                        UserNonFuncProcess record = UserNonFuncProcess.builder()
                            .userId(userId)
                            .sessionId(sessionId)
                            .functionalArea(previousProcess.getFunctionalArea())
                            .industryType(previousProcess.getIndustryType())
                            .functionalSubArea(previousProcess.getFunctionalSubArea())
                            
                            .l1(l1)
                            .l2(null)
                            .l3(null)
                            .l4(null)
                            .l5(null)
                            .build();
                        records.add(record);
                        processedPaths.add(pathKey);
                    }
                }
            } else {
                log.info("L2s were explicitly selected under L1 '{}', skipping auto-expansion", l1);
                // L2s were explicitly selected under this L1, so don't auto-expand
                // The explicitly selected L2s were already processed above
            }
        }
        
        log.info("Total non-functional records created: {}", records.size());
        return records;
    }

    // Helper methods for finding children in non-functional hierarchy
    private List<String> findAllL2ByL1(String l1, String functionalArea) {
        switch (functionalArea.toUpperCase()) {
            case "WMS":
            case "SUPPLY-CHAIN-FULFILLMENT":
            case "WAREHOUSE-MANAGEMENT":
                return wmsNonFunctionalRepository.findDistinctL2ByL1(l1);
            case "TMS":
                return tmsNonFunctionalRepository.findDistinctL2ByL1(l1);
            case "IND-AGNOUSTIC":
                return indagnousticNonFunctionalRepository.findDistinctL2ByL1(l1);
            case "RETAIL":
                return retailNonFunctionalRepository.findDistinctL2ByL1(l1);
            case "CGS":
                return cgsNonFunctionalRepository.findDistinctL2ByL1(l1);
            default:
                log.warn("Unknown functional area: {}", functionalArea);
                return new ArrayList<>();
        }
    }

    private List<String> findAllL3ByL2(String l2, String functionalArea) {
        // We need to find L1 first to get L3s
        String l1 = findL1ByL2(l2, functionalArea);
        if (l1 == null) {
            return new ArrayList<>();
        }
        
        switch (functionalArea.toUpperCase()) {
            case "WMS":
            case "SUPPLY-CHAIN-FULFILLMENT":
            case "WAREHOUSE-MANAGEMENT":
                return wmsNonFunctionalRepository.findDistinctL3ByL1AndL2(l1, l2);
            case "TMS":
                return tmsNonFunctionalRepository.findDistinctL3ByL1AndL2(l1, l2);
            case "IND-AGNOUSTIC":
                return indagnousticNonFunctionalRepository.findDistinctL3ByL1AndL2(l1, l2);
            case "RETAIL":
                return retailNonFunctionalRepository.findDistinctL3ByL1AndL2(l1, l2);
            case "CGS":
                return cgsNonFunctionalRepository.findDistinctL3ByL1AndL2(l1, l2);
            default:
                log.warn("Unknown functional area: {}", functionalArea);
                return new ArrayList<>();
        }
    }

    private String findL1ByL2(String l2, String functionalArea) {
        Optional<Object[]> pathOpt = getFirstPathForL2(l2, functionalArea);
        if (!pathOpt.isPresent()) {
            return null;
        }
        
        Object[] path = pathOpt.get();
        Object[] actualPath = path;
        if (path.length == 1 && path[0] instanceof Object[]) {
            actualPath = (Object[]) path[0];
        }
        
        return actualPath.length > 0 && actualPath[0] != null ? actualPath[0].toString() : null;
    }

    private Optional<Object[]> getFirstPathForL3(String l3, String functionalArea) {
        List<Object[]> paths = null;
        
        switch (functionalArea.toUpperCase()) {
            case "WMS":
            case "SUPPLY-CHAIN-FULFILLMENT":
            case "WAREHOUSE-MANAGEMENT":
                paths = wmsNonFunctionalRepository.findPathsByL3(l3);
                break;
            case "TMS":
                paths = tmsNonFunctionalRepository.findPathsByL3(l3);
                break;
            case "IND-AGNOUSTIC":
                paths = indagnousticNonFunctionalRepository.findPathsByL3(l3);
                break;
            case "RETAIL":
                paths = retailNonFunctionalRepository.findPathsByL3(l3);
                break;
            case "CGS":
                paths = cgsNonFunctionalRepository.findPathsByL3(l3);
                break;
            default:
                log.warn("Unknown functional area: {}", functionalArea);
                return Optional.empty();
        }
        
        return paths != null && !paths.isEmpty() ? Optional.of(paths.get(0)) : Optional.empty();
    }

    private Optional<Object[]> getFirstPathForL2(String l2, String functionalArea) {
        List<Object[]> paths = null;
        
        switch (functionalArea.toUpperCase()) {
            case "WMS":
            case "SUPPLY-CHAIN-FULFILLMENT":
            case "WAREHOUSE-MANAGEMENT":
                paths = wmsNonFunctionalRepository.findPathsByL2(l2);
                break;
            case "TMS":
                paths = tmsNonFunctionalRepository.findPathsByL2(l2);
                break;
            case "IND-AGNOUSTIC":
                paths = indagnousticNonFunctionalRepository.findPathsByL2(l2);
                break;
            case "RETAIL":
                paths = retailNonFunctionalRepository.findPathsByL2(l2);
                break;
            case "CGS":
                paths = cgsNonFunctionalRepository.findPathsByL2(l2);
                break;
            default:
                log.warn("Unknown functional area: {}", functionalArea);
                return Optional.empty();
        }
        
        return paths != null && !paths.isEmpty() ? Optional.of(paths.get(0)) : Optional.empty();
    }

    // Helper method to create a unique key for each path to avoid duplicates
    private String createPathKey(Object[] path) {
        Object[] actualPath = path;
        if (path.length == 1 && path[0] instanceof Object[]) {
            actualPath = (Object[]) path[0];
        }
        
        StringBuilder key = new StringBuilder();
        for (int i = 0; i < actualPath.length; i++) {
            if (actualPath[i] != null) {
                key.append(actualPath[i].toString()).append("|");
            } else {
                key.append("null|");
            }
        }
        return key.toString();
    }

    // Helper method to create record stopping at L2
    private UserNonFuncProcess createRecordUpToL2(Object[] path, String userId, String sessionId, FunctionalAreaDT previousProcess) {
        Object[] actualPath = path;
        if (path.length == 1 && path[0] instanceof Object[]) {
            actualPath = (Object[]) path[0];
        }
        
        return UserNonFuncProcess.builder()
            .userId(userId)
            .sessionId(sessionId)
            .functionalArea(previousProcess.getFunctionalArea())
            .industryType(previousProcess.getIndustryType())
            .functionalSubArea(previousProcess.getFunctionalSubArea())
            
            .l1(actualPath.length > 0 && actualPath[0] != null ? actualPath[0].toString() : null)
            .l2(actualPath.length > 1 && actualPath[1] != null ? actualPath[1].toString() : null)
            .l3(null)
            .l4(null)
            .l5(null)
            .build();
    }

    private UserNonFuncProcess createRecord(Object[] path, String userId, String sessionId, FunctionalAreaDT previousProcess) {
        log.info("Creating non-functional record from path array with length: {}", path.length);
        log.info("Path contents: {}", java.util.Arrays.toString(path));
        
        // Handle nested array structure - if path[0] is an Object[], extract it
        Object[] actualPath = path;
        if (path.length == 1 && path[0] instanceof Object[]) {
            actualPath = (Object[]) path[0];
            log.info("Extracted nested array with length: {}", actualPath.length);
            log.info("Actual path contents: {}", java.util.Arrays.toString(actualPath));
        }
        
        return UserNonFuncProcess.builder()
            .userId(userId)
            .sessionId(sessionId)
            .functionalArea(previousProcess.getFunctionalArea())
            .industryType(previousProcess.getIndustryType())
            .functionalSubArea(previousProcess.getFunctionalSubArea())
            
            .l1(actualPath.length > 0 && actualPath[0] != null ? actualPath[0].toString() : null)
            .l2(actualPath.length > 1 && actualPath[1] != null ? actualPath[1].toString() : null)
            .l3(actualPath.length > 2 && actualPath[2] != null ? actualPath[2].toString() : null)
            .l4(null) // Non-functional only has 3 levels
            .l5(null)
            .build();
    }
    
private NonFunctionalResponse mapToNonFunctionalScopeResponse(
        List<UserNonFuncProcess> savedRecords, 
        FunctionalAreaDT previousProcess) {
    
    log.info("Mapping {} saved non-functional records to response", savedRecords.size());
    
    if (savedRecords.isEmpty()) {
        log.warn("No non-functional records were saved - returning empty response");
        return NonFunctionalResponse.builder()
            .userId(previousProcess.getUserId()) // Get from previousProcess
            .sessionId(previousProcess.getSessionId()) // Get from previousProcess  
            .functionalArea(previousProcess.getFunctionalArea())
            .industryType(previousProcess.getIndustryType())
            .functionalSubArea(previousProcess.getFunctionalSubArea())
            
            .levelSelections(new ArrayList<>()) // Empty list
            .build();
    }
        
        List<NonFunctionalResponse.LevelPath> levelPaths = savedRecords.stream()
            .map(record -> {
                log.info("Non-functional Record: L1={}, L2={}, L3={}, L4={}, L5={}", 
                        record.getL1(), record.getL2(), record.getL3(), record.getL4(), record.getL5());
                return NonFunctionalResponse.LevelPath.builder()
                    .l1(record.getL1())
                    .l2(record.getL2())
                    .l3(record.getL3())
                    .l4(record.getL4()) // Will be null for non-functional
                    .l5(record.getL5()) // Will be null for non-functional
                    .build();
            })
            .collect(Collectors.toList());
        
        return NonFunctionalResponse.builder()
            .userId(savedRecords.get(0).getUserId())
            .sessionId(savedRecords.get(0).getSessionId())
            .functionalArea(previousProcess.getFunctionalArea())
            .industryType(previousProcess.getIndustryType())
            .functionalSubArea(previousProcess.getFunctionalSubArea())
            
            .levelSelections(levelPaths)
            .build();
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
}