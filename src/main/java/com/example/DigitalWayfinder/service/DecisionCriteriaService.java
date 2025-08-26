package com.example.DigitalWayfinder.service;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.DigitalWayfinder.dto.DecisionCriteriaResponse;
import com.example.DigitalWayfinder.entity.FunctionalAreaDT;
import com.example.DigitalWayfinder.entity.UserFunctionalProcess;
import com.example.DigitalWayfinder.entity.UserNonFuncProcess;
import com.example.DigitalWayfinder.repository.FunctionalAreaDTRepository;
import com.example.DigitalWayfinder.repository.UserFunctionalProcessRepository;
import com.example.DigitalWayfinder.repository.UserNonFuncProcessRepository;

import java.util.List;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class DecisionCriteriaService {

    private final UserFunctionalProcessRepository functionalProcessRepository;
    private final UserNonFuncProcessRepository nonFuncProcessRepository;
    private final FunctionalAreaDTRepository functionalAreaDTRepository;

    @Transactional
    public DecisionCriteriaResponse getDecisionCriteria(String userId, String sessionId) {
        log.info("Fetching decision criteria for user: {} and session: {}", userId, sessionId);
        
        try {
            // Get ALL rows for this user and session
            List<UserFunctionalProcess> functionalProcesses = functionalProcessRepository
                    .findByUserIdAndSessionId(userId, sessionId);
            
            List<UserNonFuncProcess> nonFuncProcesses = nonFuncProcessRepository
                    .findByUserIdAndSessionId(userId, sessionId);

            Optional<FunctionalAreaDT> functionalAreaDT = functionalAreaDTRepository
                    .findByUserIdAndSessionId(userId, sessionId);
            
            log.info("Found {} functional processes and {} non-functional processes", 
                    functionalProcesses.size(), nonFuncProcesses.size());
            
            if (functionalProcesses.isEmpty() && nonFuncProcesses.isEmpty()) {
                log.warn("No data found for user: {} and session: {}", userId, sessionId);
                throw new RuntimeException("No decision criteria found for the given user and session");
            }
            
            DecisionCriteriaResponse response = DecisionCriteriaResponse.builder()
                    .userId(userId)
                    .sessionId(sessionId)
                    .functionalArea(functionalAreaDT.map(FunctionalAreaDT::getFunctionalArea).orElse(null))
                    .industryType(functionalAreaDT.map(FunctionalAreaDT::getIndustryType).orElse(null))
                    .functionalSubArea(functionalAreaDT.map(FunctionalAreaDT::getFunctionalSubArea).orElse(null))
                    .build();
            
            // Convert rows to levelSelections format for functional
            if (!functionalProcesses.isEmpty()) {
                List<DecisionCriteriaResponse.LevelSelection> functionalSelections = 
                    convertRowsToLevelSelections(functionalProcesses);
                
                response.setFunctional(DecisionCriteriaResponse.FunctionalData.builder()
                    .levelSelections(functionalSelections)
                    .build());
            }
            
            // Convert rows to levelSelections format for non-functional
            if (!nonFuncProcesses.isEmpty()) {
                List<DecisionCriteriaResponse.LevelSelection> nonFunctionalSelections = 
                    convertRowsToLevelSelectionsNonFunc(nonFuncProcesses);
                
                response.setNonFunctional(DecisionCriteriaResponse.NonFunctionalData.builder()
                    .levelSelections(nonFunctionalSelections)
                    .build());
            }
            
            // Set criteria
            List<DecisionCriteriaResponse.Criteria> criteriaList = new ArrayList<>();

            if (!functionalProcesses.isEmpty()) {
                criteriaList.add(DecisionCriteriaResponse.Criteria.builder()
                    .id("functional")
                    .label("Functional Scope")
                    .inScope(true)
                    .build());
            }

            if (!nonFuncProcesses.isEmpty()) {
                criteriaList.add(DecisionCriteriaResponse.Criteria.builder()
                    .id("nonFunctional")
                    .label("Non-Functional Scope")
                    .inScope(true)
                    .build());
            }
            
            response.setCriteria(criteriaList);
            
            log.info("Successfully converted {} functional rows and {} non-functional rows", 
                    functionalProcesses.size(), nonFuncProcesses.size());
            return response;
            
        } catch (Exception e) {
            log.error("Error retrieving decision criteria for user: {} and session: {}", userId, sessionId, e);
            throw new RuntimeException("Failed to retrieve decision criteria: " + e.getMessage());
        }
    }

    // Convert functional process rows to LevelSelection objects
    private List<DecisionCriteriaResponse.LevelSelection> convertRowsToLevelSelections(
            List<UserFunctionalProcess> processes) {
        
        List<DecisionCriteriaResponse.LevelSelection> result = new ArrayList<>();
        
        for (UserFunctionalProcess process : processes) {
            DecisionCriteriaResponse.LevelSelection selection = DecisionCriteriaResponse.LevelSelection.builder()
                .l1(process.getL1())  // Direct field value
                .l2(process.getL2())  // Direct field value
                .l3(process.getL3())  // Direct field value
                .l4(process.getL4())  // Direct field value
                .l5(process.getL5())  // Direct field value (will be null)
                .build();
            result.add(selection);
            
            log.debug("Converted row: l1={}, l2={}, l3={}, l4={}, l5={}", 
                process.getL1(), process.getL2(), process.getL3(), process.getL4(), process.getL5());
        }
        
        return result;
    }
    
    // Convert non-functional process rows to LevelSelection objects
    private List<DecisionCriteriaResponse.LevelSelection> convertRowsToLevelSelectionsNonFunc(
            List<UserNonFuncProcess> processes) {
        
        List<DecisionCriteriaResponse.LevelSelection> result = new ArrayList<>();
        
        for (UserNonFuncProcess process : processes) {
            DecisionCriteriaResponse.LevelSelection selection = DecisionCriteriaResponse.LevelSelection.builder()
                .l1(process.getL1())  // Direct field value
                .l2(process.getL2())  // Direct field value
                .l3(process.getL3())  // Direct field value
                .l4(process.getL4())  // Direct field value
                .l5(process.getL5())  // Direct field value (will be null)
                .build();
            result.add(selection);
            
            log.debug("Converted non-func row: l1={}, l2={}, l3={}, l4={}, l5={}", 
                process.getL1(), process.getL2(), process.getL3(), process.getL4(), process.getL5());
        }
        
        return result;
    }
}