package com.example.DigitalWayfinder.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.DigitalWayfinder.dto.DecisionCriteriaResponse;
import com.example.DigitalWayfinder.entity.FunctionalAreaDT;
import com.example.DigitalWayfinder.entity.UserFunctionalProcess;
import com.example.DigitalWayfinder.entity.UserNonFuncProcess;
import com.example.DigitalWayfinder.repository.FunctionalAreaDTRepository;
import com.example.DigitalWayfinder.repository.UserFunctionalProcessRepository;
import com.example.DigitalWayfinder.repository.UserNonFuncProcessRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.stream.Stream;

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
    private final ObjectMapper objectMapper;
    private final FunctionalAreaDTRepository functionalAreaDTRepository;

    @Transactional
    public DecisionCriteriaResponse getDecisionCriteria(String userId, String sessionId) {
        log.info("Fetching decision criteria for user: {} and session: {}", userId, sessionId);
        
        try {
            Optional<UserFunctionalProcess> functionalProcess = functionalProcessRepository
                    .findByUserIdAndSessionId(userId, sessionId);
            
            Optional<UserNonFuncProcess> nonFuncProcess = nonFuncProcessRepository
                    .findByUserIdAndSessionId(userId, sessionId);

            Optional<FunctionalAreaDT> functionalAreaDT = functionalAreaDTRepository
                    .findByUserIdAndSessionId(userId, sessionId);
            
            if (functionalProcess.isEmpty() && nonFuncProcess.isEmpty()) {
                log.warn("No data found for user: {} and session: {}", userId, sessionId);
                throw new Exception("No decision criteria found for the given user and session");
            }
            
            DecisionCriteriaResponse response = DecisionCriteriaResponse.builder()
                    .userId(userId)
                    .sessionId(sessionId)
                    .functionalArea(functionalAreaDT.map(FunctionalAreaDT::getFunctionalArea).orElse(null))
                    .industryType(functionalAreaDT.map(FunctionalAreaDT::getIndustryType).orElse(null))
                    .functionalSubArea(functionalAreaDT.map(FunctionalAreaDT::getFunctionalSubArea).orElse(null))
                    .build();
            
            if (functionalProcess.isPresent()) {
                response.setFunctional(mapToFunctionalData(functionalProcess.get()));
            }
            
            if (nonFuncProcess.isPresent()) {
                response.setNonFunctional(mapToNonFunctionalData(nonFuncProcess.get()));
            }
            
            List<DecisionCriteriaResponse.Criteria> criteriaList = new ArrayList<>();

            if (functionalProcess.isPresent() && hasSelectedLevels(functionalProcess.get())) {
                criteriaList.add(DecisionCriteriaResponse.Criteria.builder()
                    .id("functional")
                    .label("Functional Scope")
                    .inScope(true)
                    .build());
                }

            if (nonFuncProcess.isPresent() && hasSelectedLevels(nonFuncProcess.get())) {
                criteriaList.add(DecisionCriteriaResponse.Criteria.builder()
                    .id("nonFunctional")
                    .label("Non-Functional Scope")
                    .inScope(true)
                    .build());
                }
            response.setCriteria(criteriaList);
            log.info("Successfully retrieved decision criteria for user: {} and session: {}", userId, sessionId);
            return response;
            
        } catch (RuntimeException e) {
            log.warn("Resource not found for user: {} and session: {}", userId, sessionId);
            throw e;
        } catch (Exception e) {
            log.error("Error retrieving decision criteria for user: {} and session: {}", userId, sessionId, e);
            throw new RuntimeException("Failed to retrieve decision criteria: " + e.getMessage());
        }
    }

    private boolean hasSelectedLevels(UserFunctionalProcess process) {
        return Stream.of(
            process.getL1(), process.getL2(), process.getL3(),
            process.getL4(), process.getL5()
        ).anyMatch(lv -> !isEmpty(lv));
    }

    private boolean hasSelectedLevels(UserNonFuncProcess process) {
        return Stream.of(
            process.getL1(), process.getL2(), process.getL3(),
            process.getL4(), process.getL5()
        ).anyMatch(lv -> !isEmpty(lv));
    }

    private boolean isEmpty(String json) {
        if (json == null || json.trim().isEmpty()) return true;
        try {
            List<String> list = objectMapper.readValue(
                json, objectMapper.getTypeFactory().constructCollectionType(List.class, String.class)
            );
            return list == null || list.stream().allMatch(String::isBlank);
        } catch (JsonProcessingException e) {
            return true; // Malformed = treat as empty
        }
    }



    private DecisionCriteriaResponse.FunctionalData mapToFunctionalData(UserFunctionalProcess functionalProcess) {
        return DecisionCriteriaResponse.FunctionalData.builder()
                // .functionalArea(functionalProcess.getFunctionalArea())
                // .industryType(functionalProcess.getIndustryType())
                // .functionalSubArea(functionalProcess.getFunctionalSubArea())
                .levelSelections(DecisionCriteriaResponse.LevelSelections.builder()
                        .l1(jsonStringToList(functionalProcess.getL1()))
                        .l2(jsonStringToList(functionalProcess.getL2()))
                        .l3(jsonStringToList(functionalProcess.getL3()))
                        .l4(jsonStringToList(functionalProcess.getL4()))
                        .l5(jsonStringToList(functionalProcess.getL5()))
                        .build())
                .build();
    }
    
    private DecisionCriteriaResponse.NonFunctionalData mapToNonFunctionalData(UserNonFuncProcess nonFuncProcess) {
        return DecisionCriteriaResponse.NonFunctionalData.builder()
                // .functionalArea(nonFuncProcess.getFunctionalArea())
                // .industryType(nonFuncProcess.getIndustryType())
                // .functionalSubArea(nonFuncProcess.getFunctionalSubArea())
                .levelSelections(DecisionCriteriaResponse.LevelSelections.builder()
                        .l1(jsonStringToList(nonFuncProcess.getL1()))
                        .l2(jsonStringToList(nonFuncProcess.getL2()))
                        .l3(jsonStringToList(nonFuncProcess.getL3()))
                        .l4(jsonStringToList(nonFuncProcess.getL4()))
                        .l5(jsonStringToList(nonFuncProcess.getL5()))
                        .build())
                .build();
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

