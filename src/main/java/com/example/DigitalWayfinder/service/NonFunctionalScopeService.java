package com.example.DigitalWayfinder.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.example.DigitalWayfinder.dto.NonFunctionalScopeDto;
import com.example.DigitalWayfinder.repository.CgsFunctionalRepository;
import com.example.DigitalWayfinder.repository.IndAgnousticFunctionalRepository;
import com.example.DigitalWayfinder.repository.OmsFunctionalRepository;
import com.example.DigitalWayfinder.repository.RetailFunctionalRepository;
import com.example.DigitalWayfinder.repository.TmsFunctionalRepository;
import com.example.DigitalWayfinder.repository.WmsNonFunctionalRepository;

import java.util.List;
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