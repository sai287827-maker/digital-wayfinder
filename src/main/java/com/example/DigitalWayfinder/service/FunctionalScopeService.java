package com.example.DigitalWayfinder.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList; 
import java.util.Optional;
import java.util.List;       
import java.util.stream.Collectors;
import java.util.Collections; 
import java.util.Set;
import java.util.HashSet;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.DigitalWayfinder.dto.FunctionalScopeDto;
import com.example.DigitalWayfinder.dto.FunctionalScopeRequest;
import com.example.DigitalWayfinder.dto.FunctionalScopeResponse;
import com.example.DigitalWayfinder.entity.UserFunctionalProcess;
import com.example.DigitalWayfinder.repository.CgsFunctionalRepository;
import com.example.DigitalWayfinder.repository.IndAgnousticFunctionalRepository;
import com.example.DigitalWayfinder.repository.OmsFunctionalRepository;
import com.example.DigitalWayfinder.repository.RetailFunctionalRepository;
import com.example.DigitalWayfinder.repository.TmsFunctionalRepository;
import com.example.DigitalWayfinder.repository.UserFunctionalProcessRepository;
import com.example.DigitalWayfinder.repository.WmsFunctionalRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.DigitalWayfinder.repository.FunctionalAreaDTRepository;
import com.example.DigitalWayfinder.entity.FunctionalAreaDT;

@Service
@RequiredArgsConstructor
@Slf4j
public class FunctionalScopeService {
    
    private final WmsFunctionalRepository wmsFunctionalRepository;
    private final TmsFunctionalRepository tmsFunctionalRepository;
    private final OmsFunctionalRepository omsFunctionalRepository;
    private final IndAgnousticFunctionalRepository indagnousticFunctionalRepository;
    private final RetailFunctionalRepository retailFunctionalRepository;
    private final CgsFunctionalRepository cgsFunctionalRepository;

    private final UserFunctionalProcessRepository functionalProcessRepository;
    private final ObjectMapper objectMapper;
    private final FunctionalAreaDTRepository functionalAreaDTRepository;

    public List<FunctionalScopeDto> getAllFunctionalScopesWMS() {
        log.info("Fetching all functional scope levels");
        try {
            List<Object[]> functionalScopes = wmsFunctionalRepository.findAllLevelsAsArray();
            log.info("Successfully fetched {} functional scope records", functionalScopes.size());
            
            return functionalScopes.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching functional scopes: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch functional scopes", e);
        }
    }

    public List<FunctionalScopeDto> getAllFunctionalScopesOMS() {
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

    public List<FunctionalScopeDto> getAllFunctionalScopesTMS() {
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

    public List<FunctionalScopeDto> getAllFunctionalScopesIndAgnoustic() {
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

    public List<FunctionalScopeDto> getAllFunctionalScopesRetail() {
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

    public List<FunctionalScopeDto> getAllFunctionalScopesCGS() {
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

    private FunctionalScopeDto convertToDto(Object[] scopeArray) {
        return new FunctionalScopeDto(
            scopeArray.length > 0 ? (String) scopeArray[0] : null,
            scopeArray.length > 1 ? (String) scopeArray[1] : null,
            scopeArray.length > 2 ? (String) scopeArray[2] : null,
            scopeArray.length > 3 ? (String) scopeArray[3] : null,
            scopeArray.length > 4 ? (String) scopeArray[4] : null
        );
    }

    @Transactional
    public FunctionalScopeResponse saveFunctionalScope(FunctionalScopeRequest request, String userId, String sessionId) {
        log.info("Saving functional scope for user: {} and session: {}", userId, sessionId);
        
        try {
            // First, delete all existing records for this user/session
            functionalProcessRepository.deleteByUserIdAndSessionId(userId, sessionId);
            
            // Get the functional area info from previous step
            FunctionalAreaDT previousProcess = functionalAreaDTRepository
                .findByUserIdAndSessionId(userId, sessionId)
                .orElseThrow(() -> new RuntimeException("Previous functional process not found"));
            
            List<UserFunctionalProcess> recordsToSave = new ArrayList<>();
            
            FunctionalScopeRequest.LevelSelections levelSelections = request.getLevelSelections();
            
            if (levelSelections != null) {
                List<UserFunctionalProcess> records = convertToMultipleRecords(
                    levelSelections, userId, sessionId, previousProcess);
                recordsToSave.addAll(records);
            }
            
            // Save all records at once
            List<UserFunctionalProcess> savedRecords = functionalProcessRepository.saveAll(recordsToSave);
            
            log.info("Successfully saved {} functional scope records", savedRecords.size());
            return mapToFunctionalScopeResponse(savedRecords, previousProcess);
            
        } catch (Exception e) {
            log.error("Error saving functional scope", e);
            throw new RuntimeException("Failed to save functional scope: " + e.getMessage());
        }
    }
    
private List<UserFunctionalProcess> convertToMultipleRecords(
        FunctionalScopeRequest.LevelSelections levelSelections,
        String userId, String sessionId, FunctionalAreaDT previousProcess) {
    
    List<UserFunctionalProcess> records = new ArrayList<>();
    Set<String> processedPaths = new HashSet<>();
    
    List<String> l1List = levelSelections.getL1() != null ? levelSelections.getL1() : new ArrayList<>();
    List<String> l2List = levelSelections.getL2() != null ? levelSelections.getL2() : new ArrayList<>();
    List<String> l3List = levelSelections.getL3() != null ? levelSelections.getL3() : new ArrayList<>();
    List<String> l4List = levelSelections.getL4() != null ? levelSelections.getL4() : new ArrayList<>();
    
    String functionalArea = previousProcess.getFunctionalArea();
    
    log.info("Processing selections - L1: {}, L2: {}, L3: {}, L4: {}", 
             l1List.size(), l2List.size(), l3List.size(), l4List.size());
    
    // Strategy: Build a selection tree to understand user intent
    
    // 1. Process explicitly selected L4s first
    for (String l4 : l4List) {
        Optional<Object[]> pathOpt = findCompletePathByL4(l4, functionalArea);
        if (pathOpt.isPresent()) {
            Object[] path = pathOpt.get();
            String pathKey = createPathKey(path);
            if (!processedPaths.contains(pathKey)) {
                records.add(createRecord(path, userId, sessionId, previousProcess));
                processedPaths.add(pathKey);
                log.info("Added explicitly selected L4: {}", l4);
            }
        }
    }
    
    // 2. Process L3 selections
    for (String l3 : l3List) {
        // Check if user selected any L4s under this L3
        List<String> l4sUnderThisL3 = findAllL4ByL3(l3, functionalArea);
        List<String> selectedL4sUnderThisL3 = l4sUnderThisL3.stream()
                .filter(l4List::contains)
                .collect(Collectors.toList());
        
        if (selectedL4sUnderThisL3.isEmpty()) {
            // No L4s selected under this L3 → auto-expand all L4s
            log.info("No L4s selected under L3 '{}', auto-expanding all L4s", l3);
            for (String l4 : l4sUnderThisL3) {
                Optional<Object[]> pathOpt = findCompletePathByL4(l4, functionalArea);
                if (pathOpt.isPresent()) {
                    Object[] path = pathOpt.get();
                    String pathKey = createPathKey(path);
                    if (!processedPaths.contains(pathKey)) {
                        records.add(createRecord(path, userId, sessionId, previousProcess));
                        processedPaths.add(pathKey);
                        log.info("Auto-expanded L4 under L3 '{}': {}", l3, l4);
                    }
                }
            }
            
            // If no L4s exist, save the L3 itself
            if (l4sUnderThisL3.isEmpty()) {
                Optional<Object[]> pathOpt = getFirstPathForL3(l3, functionalArea);
                if (pathOpt.isPresent()) {
                    Object[] path = pathOpt.get();
                    String pathKey = createPathKey(path);
                    if (!processedPaths.contains(pathKey)) {
                        records.add(createRecordUpToL3(path, userId, sessionId, previousProcess));
                        processedPaths.add(pathKey);
                        log.info("Added L3 with no L4 children: {}", l3);
                    }
                }
            }
        } else {
            log.info("L4s were explicitly selected under L3 '{}', skipping auto-expansion", l3);
            // L4s were explicitly selected under this L3, so don't auto-expand
            // The explicitly selected L4s were already processed above
        }
    }
    
    // 3. Process L2 selections
    for (String l2 : l2List) {
        // Find all L3s under this L2
        List<String> l3sUnderThisL2 = findAllL3ByL2(l2, functionalArea);
        List<String> selectedL3sUnderThisL2 = l3sUnderThisL2.stream()
                .filter(l3List::contains)
                .collect(Collectors.toList());
        
        if (selectedL3sUnderThisL2.isEmpty()) {
            // No L3s selected under this L2 → auto-expand all L3s and their L4s
            log.info("No L3s selected under L2 '{}', auto-expanding all L3s and L4s", l2);
            for (String l3 : l3sUnderThisL2) {
                List<String> l4sUnderThisL3 = findAllL4ByL3(l3, functionalArea);
                for (String l4 : l4sUnderThisL3) {
                    Optional<Object[]> pathOpt = findCompletePathByL4(l4, functionalArea);
                    if (pathOpt.isPresent()) {
                        Object[] path = pathOpt.get();
                        String pathKey = createPathKey(path);
                        if (!processedPaths.contains(pathKey)) {
                            records.add(createRecord(path, userId, sessionId, previousProcess));
                            processedPaths.add(pathKey);
                            log.info("Auto-expanded L4 under L2 '{}' -> L3 '{}': {}", l2, l3, l4);
                        }
                    }
                }
                
                // If no L4s exist under this L3, save the L3
                if (l4sUnderThisL3.isEmpty()) {
                    Optional<Object[]> pathOpt = getFirstPathForL3(l3, functionalArea);
                    if (pathOpt.isPresent()) {
                        Object[] path = pathOpt.get();
                        String pathKey = createPathKey(path);
                        if (!processedPaths.contains(pathKey)) {
                            records.add(createRecordUpToL3(path, userId, sessionId, previousProcess));
                            processedPaths.add(pathKey);
                            log.info("Auto-expanded L3 with no L4s under L2 '{}': {}", l2, l3);
                        }
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
    
    // 4. Process L1 selections
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
                    List<String> l4sUnderThisL3 = findAllL4ByL3(l3, functionalArea);
                    for (String l4 : l4sUnderThisL3) {
                        Optional<Object[]> pathOpt = findCompletePathByL4(l4, functionalArea);
                        if (pathOpt.isPresent()) {
                            Object[] path = pathOpt.get();
                            String pathKey = createPathKey(path);
                            if (!processedPaths.contains(pathKey)) {
                                records.add(createRecord(path, userId, sessionId, previousProcess));
                                processedPaths.add(pathKey);
                                log.info("Auto-expanded L4 under L1 '{}' -> L2 '{}' -> L3 '{}': {}", l1, l2, l3, l4);
                            }
                        }
                    }
                    
                    if (l4sUnderThisL3.isEmpty()) {
                        Optional<Object[]> pathOpt = getFirstPathForL3(l3, functionalArea);
                        if (pathOpt.isPresent()) {
                            Object[] path = pathOpt.get();
                            String pathKey = createPathKey(path);
                            if (!processedPaths.contains(pathKey)) {
                                records.add(createRecordUpToL3(path, userId, sessionId, previousProcess));
                                processedPaths.add(pathKey);
                            }
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
                    UserFunctionalProcess record = UserFunctionalProcess.builder()
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
    
    log.info("Total records created: {}", records.size());
    return records;
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
private UserFunctionalProcess createRecordUpToL2(Object[] path, String userId, String sessionId, FunctionalAreaDT previousProcess) {
    Object[] actualPath = path;
    if (path.length == 1 && path[0] instanceof Object[]) {
        actualPath = (Object[]) path[0];
    }
    
    return UserFunctionalProcess.builder()
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

// Helper method to create record stopping at L3
private UserFunctionalProcess createRecordUpToL3(Object[] path, String userId, String sessionId, FunctionalAreaDT previousProcess) {
    Object[] actualPath = path;
    if (path.length == 1 && path[0] instanceof Object[]) {
        actualPath = (Object[]) path[0];
    }
    
    return UserFunctionalProcess.builder()
        .userId(userId)
        .sessionId(sessionId)
        .functionalArea(previousProcess.getFunctionalArea())
        .industryType(previousProcess.getIndustryType())
        .functionalSubArea(previousProcess.getFunctionalSubArea())
        .l1(actualPath.length > 0 && actualPath[0] != null ? actualPath[0].toString() : null)
        .l2(actualPath.length > 1 && actualPath[1] != null ? actualPath[1].toString() : null)
        .l3(actualPath.length > 2 && actualPath[2] != null ? actualPath[2].toString() : null)
        .l4(null)
        .l5(null)
        .build();
}

    private Optional<Object[]> findCompletePathByL4(String l4, String functionalArea) {
        switch (functionalArea.toUpperCase()) {
            case "WMS":
            case "SUPPLY-CHAIN-FULFILLMENT":
            case "WAREHOUSE-MANAGEMENT":
                return wmsFunctionalRepository.findCompletePathByL4(l4);
            case "TMS":
                return tmsFunctionalRepository.findCompletePathByL4(l4);
            case "OMS":
                return omsFunctionalRepository.findCompletePathByL4(l4);
            case "IND-AGNOUSTIC":
                return indagnousticFunctionalRepository.findCompletePathByL4(l4);
            case "RETAIL":
                return retailFunctionalRepository.findCompletePathByL4(l4);
            case "CGS":
                return cgsFunctionalRepository.findCompletePathByL4(l4);
            default:
                log.warn("Unknown functional area: {}", functionalArea);
                return Optional.empty();
        }
    }

    private Optional<Object[]> getFirstPathForL3(String l3, String functionalArea) {
        List<Object[]> paths = null;
        
        switch (functionalArea.toUpperCase()) {
            case "WMS":
            case "SUPPLY-CHAIN-FULFILLMENT":
            case "WAREHOUSE-MANAGEMENT":
                paths = wmsFunctionalRepository.findPathsByL3(l3);
                break;
            case "TMS":
                paths = tmsFunctionalRepository.findPathsByL3(l3);
                break;
            case "OMS":
                paths = omsFunctionalRepository.findPathsByL3(l3);
                break;
            case "IND-AGNOUSTIC":
                paths = indagnousticFunctionalRepository.findPathsByL3(l3);
                break;
            case "RETAIL":
                paths = retailFunctionalRepository.findPathsByL3(l3);
                break;
            case "CGS":
                paths = cgsFunctionalRepository.findPathsByL3(l3);
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
                paths = wmsFunctionalRepository.findPathsByL2(l2);
                break;
            case "TMS":
                paths = tmsFunctionalRepository.findPathsByL2(l2);
                break;
            case "OMS":
                paths = omsFunctionalRepository.findPathsByL2(l2);
                break;
            case "IND-AGNOUSTIC":
                paths = indagnousticFunctionalRepository.findPathsByL2(l2);
                break;
            case "RETAIL":
                paths = retailFunctionalRepository.findPathsByL2(l2);
                break;
            case "CGS":
                paths = cgsFunctionalRepository.findPathsByL2(l2);
                break;
            default:
                log.warn("Unknown functional area: {}", functionalArea);
                return Optional.empty();
        }
        
        return paths != null && !paths.isEmpty() ? Optional.of(paths.get(0)) : Optional.empty();
    }

    private List<String> findAllL2ByL1(String l1, String functionalArea) {
    switch (functionalArea.toUpperCase()) {
        case "WMS":
        case "SUPPLY-CHAIN-FULFILLMENT":
        case "WAREHOUSE-MANAGEMENT":
            return wmsFunctionalRepository.findDistinctL2ByL1(l1);
        case "TMS":
            return tmsFunctionalRepository.findDistinctL2ByL1(l1);
        case "OMS":
            return omsFunctionalRepository.findDistinctL2ByL1(l1);
        case "IND-AGNOUSTIC":
            return indagnousticFunctionalRepository.findDistinctL2ByL1(l1);
        case "RETAIL":
            return retailFunctionalRepository.findDistinctL2ByL1(l1);
        case "CGS":
            return cgsFunctionalRepository.findDistinctL2ByL1(l1);
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
            return wmsFunctionalRepository.findDistinctL3ByL1AndL2(l1, l2);
        case "TMS":
            return tmsFunctionalRepository.findDistinctL3ByL1AndL2(l1, l2);
        case "OMS":
            return omsFunctionalRepository.findDistinctL3ByL1AndL2(l1, l2);
        case "IND-AGNOUSTIC":
            return indagnousticFunctionalRepository.findDistinctL3ByL1AndL2(l1, l2);
        case "RETAIL":
            return retailFunctionalRepository.findDistinctL3ByL1AndL2(l1, l2);
        case "CGS":
            return cgsFunctionalRepository.findDistinctL3ByL1AndL2(l1, l2);
        default:
            log.warn("Unknown functional area: {}", functionalArea);
            return new ArrayList<>();
    }
}

private List<String> findAllL4ByL3(String l3, String functionalArea) {
    // We need to find L1 and L2 first to get L4s
    Optional<Object[]> pathOpt = getFirstPathForL3(l3, functionalArea);
    if (!pathOpt.isPresent()) {
        return new ArrayList<>();
    }
    
    Object[] path = pathOpt.get();
    Object[] actualPath = path;
    if (path.length == 1 && path[0] instanceof Object[]) {
        actualPath = (Object[]) path[0];
    }
    
    if (actualPath.length < 2) {
        return new ArrayList<>();
    }
    
    String l1 = actualPath[0] != null ? actualPath[0].toString() : null;
    String l2 = actualPath[1] != null ? actualPath[1].toString() : null;
    
    if (l1 == null || l2 == null) {
        return new ArrayList<>();
    }
    
    switch (functionalArea.toUpperCase()) {
        case "WMS":
        case "SUPPLY-CHAIN-FULFILLMENT":
        case "WAREHOUSE-MANAGEMENT":
            return wmsFunctionalRepository.findDistinctL4ByL1AndL2AndL3(l1, l2, l3);
        case "TMS":
            return tmsFunctionalRepository.findDistinctL4ByL1AndL2AndL3(l1, l2, l3);
        case "OMS":
            return omsFunctionalRepository.findDistinctL4ByL1AndL2AndL3(l1, l2, l3);
        case "IND-AGNOUSTIC":
            return indagnousticFunctionalRepository.findDistinctL4ByL1AndL2AndL3(l1, l2, l3);
        case "RETAIL":
            return retailFunctionalRepository.findDistinctL4ByL1AndL2AndL3(l1, l2, l3);
        case "CGS":
            return cgsFunctionalRepository.findDistinctL4ByL1AndL2AndL3(l1, l2, l3);
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

    private UserFunctionalProcess createRecord(Object[] path, String userId, String sessionId, FunctionalAreaDT previousProcess) {
        log.info("Creating record from path array with length: {}", path.length);
        log.info("Path contents: {}", java.util.Arrays.toString(path));
        
        // Handle nested array structure - if path[0] is an Object[], extract it
        Object[] actualPath = path;
        if (path.length == 1 && path[0] instanceof Object[]) {
            actualPath = (Object[]) path[0];
            log.info("Extracted nested array with length: {}", actualPath.length);
            log.info("Actual path contents: {}", java.util.Arrays.toString(actualPath));
        }
        
        return UserFunctionalProcess.builder()
            .userId(userId)
            .sessionId(sessionId)
            .functionalArea(previousProcess.getFunctionalArea())
            .industryType(previousProcess.getIndustryType())
            .functionalSubArea(previousProcess.getFunctionalSubArea())
            .l1(actualPath.length > 0 && actualPath[0] != null ? actualPath[0].toString() : null)
            .l2(actualPath.length > 1 && actualPath[1] != null ? actualPath[1].toString() : null)
            .l3(actualPath.length > 2 && actualPath[2] != null ? actualPath[2].toString() : null)
            .l4(actualPath.length > 3 && actualPath[3] != null ? actualPath[3].toString() : null)
            .l5(null) // Since you don't have L5
            .build();
    }
    
    private FunctionalScopeResponse mapToFunctionalScopeResponse(
            List<UserFunctionalProcess> savedRecords, 
            FunctionalAreaDT previousProcess) {
        
        log.info("Mapping {} saved records to response", savedRecords.size());
        
        List<FunctionalScopeResponse.LevelPath> levelPaths = savedRecords.stream()
            .map(record -> {
                log.info("Record: L1={}, L2={}, L3={}, L4={}", 
                        record.getL1(), record.getL2(), record.getL3(), record.getL4());
                return FunctionalScopeResponse.LevelPath.builder()
                    .l1(record.getL1())
                    .l2(record.getL2())
                    .l3(record.getL3())
                    .l4(record.getL4())
                    .build();
            })
            .collect(Collectors.toList());
        
        return FunctionalScopeResponse.builder()
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