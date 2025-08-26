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
import java.util.Arrays;

import java.time.LocalDateTime;

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
        
        // Safely get lists with null checks
        List<String> l1List = levelSelections.getL1() != null ? levelSelections.getL1() : new ArrayList<>();
        List<String> l2List = levelSelections.getL2() != null ? levelSelections.getL2() : new ArrayList<>();
        List<String> l3List = levelSelections.getL3() != null ? levelSelections.getL3() : new ArrayList<>();
        List<String> l4List = levelSelections.getL4() != null ? levelSelections.getL4() : new ArrayList<>();
        
        String functionalArea = determineFunctionalAreaForRepository(previousProcess);
        
        log.info("Processing selections for functionalArea: {} - L1: {}, L2: {}, L3: {}, L4: {}", 
                 functionalArea, l1List.size(), l2List.size(), l3List.size(), l4List.size());
        
        // Debug: Log the actual selections
        log.info("L1 selections: {}", l1List);
        log.info("L2 selections: {}", l2List);
        log.info("L3 selections: {}", l3List);
        log.info("L4 selections: {}", l4List);
        
        // Strategy: Process from most specific to least specific
        
        // 1. Process explicitly selected L4s first
        for (String l4 : l4List) {
            log.info("Processing L4: {}", l4);
            Optional<Object[]> pathOpt = findCompletePathByL4(l4, functionalArea);
            if (pathOpt.isPresent()) {
                Object[] path = pathOpt.get();
                log.info("Found path for L4 '{}': {}", l4, Arrays.toString(path));
                String pathKey = createPathKey(path);
                if (!processedPaths.contains(pathKey)) {
                    UserFunctionalProcess record = createRecordSafe(path, userId, sessionId, previousProcess);
                    if (record != null) {
                        records.add(record);
                        processedPaths.add(pathKey);
                        log.info("Added record for L4: {}", l4);
                    } else {
                        log.warn("Failed to create record for L4: {}", l4);
                    }
                }
            } else {
                log.warn("No complete path found for L4: {}", l4);
            }
        }
        
        // 2. Process L3 selections that don't have corresponding L4 selections
        for (String l3 : l3List) {
            log.info("Processing L3: {}", l3);
            
            // Check if any L4s under this L3 were already selected
            List<String> l4sUnderL3 = findAllL4ByL3Safe(l3, functionalArea);
            boolean hasSelectedL4s = l4sUnderL3.stream().anyMatch(l4List::contains);
            
            if (!hasSelectedL4s) {
                // Auto-expand all L4s under this L3
                if (!l4sUnderL3.isEmpty()) {
                    log.info("Auto-expanding {} L4s under L3: {}", l4sUnderL3.size(), l3);
                    for (String l4 : l4sUnderL3) {
                        Optional<Object[]> pathOpt = findCompletePathByL4(l4, functionalArea);
                        if (pathOpt.isPresent()) {
                            String pathKey = createPathKey(pathOpt.get());
                            if (!processedPaths.contains(pathKey)) {
                                UserFunctionalProcess record = createRecordSafe(pathOpt.get(), userId, sessionId, previousProcess);
                                if (record != null) {
                                    records.add(record);
                                    processedPaths.add(pathKey);
                                }
                            }
                        }
                    }
                } else {
                    // No L4s under this L3, save the L3 itself
                    log.info("No L4s found under L3: {}, saving L3 record", l3);
                    UserFunctionalProcess record = createRecordForL3(l3, userId, sessionId, previousProcess, functionalArea);
                    if (record != null) {
                        String pathKey = createPathKeyFromRecord(record);
                        if (!processedPaths.contains(pathKey)) {
                            records.add(record);
                            processedPaths.add(pathKey);
                        }
                    }
                }
            }
        }
        
        // 3. Process L2 selections that don't have corresponding L3 selections
        for (String l2 : l2List) {
            log.info("Processing L2: {}", l2);
            
            List<String> l3sUnderL2 = findAllL3ByL2Safe(l2, functionalArea);
            boolean hasSelectedL3s = l3sUnderL2.stream().anyMatch(l3List::contains);
            
            if (!hasSelectedL3s) {
                if (!l3sUnderL2.isEmpty()) {
                    log.info("Auto-expanding {} L3s under L2: {}", l3sUnderL2.size(), l2);
                    for (String l3 : l3sUnderL2) {
                        List<String> l4sUnderL3 = findAllL4ByL3Safe(l3, functionalArea);
                        if (!l4sUnderL3.isEmpty()) {
                            for (String l4 : l4sUnderL3) {
                                Optional<Object[]> pathOpt = findCompletePathByL4(l4, functionalArea);
                                if (pathOpt.isPresent()) {
                                    String pathKey = createPathKey(pathOpt.get());
                                    if (!processedPaths.contains(pathKey)) {
                                        UserFunctionalProcess record = createRecordSafe(pathOpt.get(), userId, sessionId, previousProcess);
                                        if (record != null) {
                                            records.add(record);
                                            processedPaths.add(pathKey);
                                        }
                                    }
                                }
                            }
                        } else {
                            UserFunctionalProcess record = createRecordForL3(l3, userId, sessionId, previousProcess, functionalArea);
                            if (record != null) {
                                String pathKey = createPathKeyFromRecord(record);
                                if (!processedPaths.contains(pathKey)) {
                                    records.add(record);
                                    processedPaths.add(pathKey);
                                }
                            }
                        }
                    }
                } else {
                    log.info("No L3s found under L2: {}, saving L2 record", l2);
                    UserFunctionalProcess record = createRecordForL2(l2, userId, sessionId, previousProcess, functionalArea);
                    if (record != null) {
                        String pathKey = createPathKeyFromRecord(record);
                        if (!processedPaths.contains(pathKey)) {
                            records.add(record);
                            processedPaths.add(pathKey);
                        }
                    }
                }
            }
        }
        
        // 4. Process L1 selections that don't have corresponding L2 selections
        for (String l1 : l1List) {
            log.info("Processing L1: {}", l1);
            
            List<String> l2sUnderL1 = findAllL2ByL1Safe(l1, functionalArea);
            boolean hasSelectedL2s = l2sUnderL1.stream().anyMatch(l2List::contains);
            
            if (!hasSelectedL2s) {
                if (!l2sUnderL1.isEmpty()) {
                    log.info("Auto-expanding {} L2s under L1: {}", l2sUnderL1.size(), l1);
                    // Auto-expand all L2s under this L1 (and their children)
                    for (String l2 : l2sUnderL1) {
                        List<String> l3sUnderL2 = findAllL3ByL2Safe(l2, functionalArea);
                        if (!l3sUnderL2.isEmpty()) {
                            for (String l3 : l3sUnderL2) {
                                List<String> l4sUnderL3 = findAllL4ByL3Safe(l3, functionalArea);
                                if (!l4sUnderL3.isEmpty()) {
                                    for (String l4 : l4sUnderL3) {
                                        Optional<Object[]> pathOpt = findCompletePathByL4(l4, functionalArea);
                                        if (pathOpt.isPresent()) {
                                            String pathKey = createPathKey(pathOpt.get());
                                            if (!processedPaths.contains(pathKey)) {
                                                UserFunctionalProcess record = createRecordSafe(pathOpt.get(), userId, sessionId, previousProcess);
                                                if (record != null) {
                                                    records.add(record);
                                                    processedPaths.add(pathKey);
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    UserFunctionalProcess record = createRecordForL3(l3, userId, sessionId, previousProcess, functionalArea);
                                    if (record != null) {
                                        String pathKey = createPathKeyFromRecord(record);
                                        if (!processedPaths.contains(pathKey)) {
                                            records.add(record);
                                            processedPaths.add(pathKey);
                                        }
                                    }
                                }
                            }
                        } else {
                            UserFunctionalProcess record = createRecordForL2(l2, userId, sessionId, previousProcess, functionalArea);
                            if (record != null) {
                                String pathKey = createPathKeyFromRecord(record);
                                if (!processedPaths.contains(pathKey)) {
                                    records.add(record);
                                    processedPaths.add(pathKey);
                                }
                            }
                        }
                    }
                } else {
                    log.info("No L2s found under L1: {}, saving L1 record", l1);
                    UserFunctionalProcess record = createRecordForL1(l1, userId, sessionId, previousProcess);
                    if (record != null) {
                        String pathKey = createPathKeyFromRecord(record);
                        if (!processedPaths.contains(pathKey)) {
                            records.add(record);
                            processedPaths.add(pathKey);
                        }
                    }
                }
            }
        }
        
        log.info("Total records created: {}", records.size());
        return records;
    }

    /**
     * Determines which repository to use based on the combination of functionalArea, 
     * industryType, and functionalSubArea
     */
    private String determineFunctionalAreaForRepository(FunctionalAreaDT previousProcess) {
        String functionalArea = previousProcess.getFunctionalArea();
        String industryType = previousProcess.getIndustryType();
        String functionalSubArea = previousProcess.getFunctionalSubArea();
        
        log.info("Determining repository for - functionalArea: {}, industryType: {}, functionalSubArea: {}", 
                 functionalArea, industryType, functionalSubArea);
        
        // Priority logic - check functionalSubArea first as it's more specific
        if (functionalSubArea != null) {
            String subAreaUpper = functionalSubArea.toUpperCase();
            if (subAreaUpper.contains("WAREHOUSE") || subAreaUpper.contains("WMS")) {
                log.info("Using WMS repository based on functionalSubArea: {}", functionalSubArea);
                return "WMS";
            }
            if (subAreaUpper.contains("TRANSPORTATION") || subAreaUpper.contains("TMS")) {
                log.info("Using TMS repository based on functionalSubArea: {}", functionalSubArea);
                return "TRANSPORTATION-MANAGEMENT";
            }
            if (subAreaUpper.contains("ORDER") || subAreaUpper.contains("OMS")) {
                log.info("Using OMS repository based on functionalSubArea: {}", functionalSubArea);
                return "OMS";
            }
            if (subAreaUpper.contains("RETAIL")) {
                log.info("Using RETAIL repository based on functionalSubArea: {}", functionalSubArea);
                return "RETAIL";
            }
            if (subAreaUpper.contains("CGS")) {
                log.info("Using CGS repository based on functionalSubArea: {}", functionalSubArea);
                return "CGS";
            }
        }
        
        // Fall back to industryType
        if (industryType != null) {
            String industryUpper = industryType.toUpperCase();
            if (industryUpper.contains("TRANSPORTATION") || industryUpper.contains("TMS")) {
                log.info("Using TMS repository based on industryType: {}", industryType);
                return "TRANSPORTATION-MANAGEMENT";
            }
            if (industryUpper.contains("WAREHOUSE") || industryUpper.contains("WMS")) {
                log.info("Using WMS repository based on industryType: {}", industryType);
                return "WMS";
            }
            if (industryUpper.contains("ORDER") || industryUpper.contains("OMS")) {
                log.info("Using OMS repository based on industryType: {}", industryType);
                return "OMS";
            }
            if (industryUpper.contains("RETAIL")) {
                log.info("Using RETAIL repository based on industryType: {}", industryType);
                return "RETAIL";
            }
            if (industryUpper.contains("CGS")) {
                log.info("Using CGS repository based on industryType: {}", industryType);
                return "CGS";
            }
        }
        
        // Finally fall back to functionalArea
        if (functionalArea != null) {
            String areaUpper = functionalArea.toUpperCase();
            if (areaUpper.contains("SUPPLY-CHAIN") || areaUpper.contains("WAREHOUSE") || areaUpper.contains("WMS")) {
                log.info("Using WMS repository based on functionalArea: {}", functionalArea);
                return "WMS";
            }
            if (areaUpper.contains("TRANSPORTATION") || areaUpper.contains("TMS")) {
                log.info("Using TMS repository based on functionalArea: {}", functionalArea);
                return "TRANSPORTATION-MANAGEMENT";
            }
            if (areaUpper.contains("ORDER") || areaUpper.contains("OMS")) {
                log.info("Using OMS repository based on functionalArea: {}", functionalArea);
                return "OMS";
            }
            if (areaUpper.contains("RETAIL")) {
                log.info("Using RETAIL repository based on functionalArea: {}", functionalArea);
                return "RETAIL";
            }
            if (areaUpper.contains("CGS")) {
                log.info("Using CGS repository based on functionalArea: {}", functionalArea);
                return "CGS";
            }
        }
        
        // Default fallback to IND-AGNOUSTIC
        log.warn("Could not determine specific repository, falling back to IND-AGNOUSTIC. functionalArea: {}, industryType: {}, functionalSubArea: {}", 
                 functionalArea, industryType, functionalSubArea);
        return "IND-AGNOUSTIC";
    }

    // Safe wrapper methods with better error handling and logging
    private List<String> findAllL2ByL1Safe(String l1, String functionalArea) {
        try {
            return findAllL2ByL1(l1, functionalArea);
        } catch (Exception e) {
            log.error("Error finding L2s for L1 '{}' in area '{}': {}", l1, functionalArea, e.getMessage());
            return new ArrayList<>();
        }
    }

    private List<String> findAllL3ByL2Safe(String l2, String functionalArea) {
        try {
            return findAllL3ByL2(l2, functionalArea);
        } catch (Exception e) {
            log.error("Error finding L3s for L2 '{}' in area '{}': {}", l2, functionalArea, e.getMessage());
            return new ArrayList<>();
        }
    }

    private List<String> findAllL4ByL3Safe(String l3, String functionalArea) {
        try {
            return findAllL4ByL3(l3, functionalArea);
        } catch (Exception e) {
            log.error("Error finding L4s for L3 '{}' in area '{}': {}", l3, functionalArea, e.getMessage());
            return new ArrayList<>();
        }
    }

    private UserFunctionalProcess createRecordSafe(Object[] path, String userId, String sessionId, FunctionalAreaDT previousProcess) {
        try {
            if (path == null || path.length == 0) {
                log.warn("Path is null or empty");
                return null;
            }
            
            log.info("Creating record from path: {}", Arrays.toString(path));
            
            // Handle nested array structure
            Object[] actualPath = path;
            if (path.length == 1 && path[0] instanceof Object[]) {
                actualPath = (Object[]) path[0];
                log.info("Extracted nested array: {}", Arrays.toString(actualPath));
            }
            
            UserFunctionalProcess record = UserFunctionalProcess.builder()
                .userId(userId)
                .sessionId(sessionId)
                .functionalArea(previousProcess.getFunctionalArea())
                .industryType(previousProcess.getIndustryType())
                .functionalSubArea(previousProcess.getFunctionalSubArea())
                .l1(actualPath.length > 0 && actualPath[0] != null ? actualPath[0].toString() : null)
                .l2(actualPath.length > 1 && actualPath[1] != null ? actualPath[1].toString() : null)
                .l3(actualPath.length > 2 && actualPath[2] != null ? actualPath[2].toString() : null)
                .l4(actualPath.length > 3 && actualPath[3] != null ? actualPath[3].toString() : null)
                .l5(null)
                .build();
            
            log.info("Created record: L1={}, L2={}, L3={}, L4={}", record.getL1(), record.getL2(), record.getL3(), record.getL4());
            return record;
            
        } catch (Exception e) {
            log.error("Error creating record from path: {}", e.getMessage(), e);
            return null;
        }
    }

    private UserFunctionalProcess createRecordForL1(String l1, String userId, String sessionId, FunctionalAreaDT previousProcess) {
        return UserFunctionalProcess.builder()
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
    }

    private UserFunctionalProcess createRecordForL2(String l2, String userId, String sessionId, FunctionalAreaDT previousProcess, String functionalArea) {
        // Try to find the L1 for this L2
        String l1 = findL1ByL2(l2, functionalArea);
        
        return UserFunctionalProcess.builder()
            .userId(userId)
            .sessionId(sessionId)
            .functionalArea(previousProcess.getFunctionalArea())
            .industryType(previousProcess.getIndustryType())
            .functionalSubArea(previousProcess.getFunctionalSubArea())
            .l1(l1)
            .l2(l2)
            .l3(null)
            .l4(null)
            .l5(null)
            .build();
    }

    private UserFunctionalProcess createRecordForL3(String l3, String userId, String sessionId, FunctionalAreaDT previousProcess, String functionalArea) {
        // Try to find the complete path up to L3
        Optional<Object[]> pathOpt = getFirstPathForL3(l3, functionalArea);
        
        String l1 = null;
        String l2 = null;
        
        if (pathOpt.isPresent()) {
            Object[] path = pathOpt.get();
            Object[] actualPath = path.length == 1 && path[0] instanceof Object[] ? (Object[]) path[0] : path;
            
            l1 = actualPath.length > 0 && actualPath[0] != null ? actualPath[0].toString() : null;
            l2 = actualPath.length > 1 && actualPath[1] != null ? actualPath[1].toString() : null;
        }
        
        return UserFunctionalProcess.builder()
            .userId(userId)
            .sessionId(sessionId)
            .functionalArea(previousProcess.getFunctionalArea())
            .industryType(previousProcess.getIndustryType())
            .functionalSubArea(previousProcess.getFunctionalSubArea())
            .l1(l1)
            .l2(l2)
            .l3(l3)
            .l4(null)
            .l5(null)
            .build();
    }

    private String createPathKeyFromRecord(UserFunctionalProcess record) {
        return String.format("%s|%s|%s|%s|%s", 
            record.getL1() != null ? record.getL1() : "null",
            record.getL2() != null ? record.getL2() : "null",
            record.getL3() != null ? record.getL3() : "null",
            record.getL4() != null ? record.getL4() : "null",
            record.getL5() != null ? record.getL5() : "null");
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
            case "TRANSPORTATION-MANAGEMENT":
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
            case "TRANSPORTATION-MANAGEMENT":
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
            case "TRANSPORTATION-MANAGEMENT":
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
            case "TRANSPORTATION-MANAGEMENT":
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
            case "TRANSPORTATION-MANAGEMENT":
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
            case "TRANSPORTATION-MANAGEMENT":
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
        log.info("Path contents: {}", Arrays.toString(path));
        
        // Handle nested array structure - if path[0] is an Object[], extract it
        Object[] actualPath = path;
        if (path.length == 1 && path[0] instanceof Object[]) {
            actualPath = (Object[]) path[0];
            log.info("Extracted nested array with length: {}", actualPath.length);
            log.info("Actual path contents: {}", Arrays.toString(actualPath));
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