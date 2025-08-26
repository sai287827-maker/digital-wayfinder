package com.example.DigitalWayfinder.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.DigitalWayfinder.dto.DecisionCriteriaResponse;
import com.example.DigitalWayfinder.dto.UserSession;
import com.example.DigitalWayfinder.service.DecisionCriteriaService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/decision-tree/functional-scope/decision-criteria")
@RequiredArgsConstructor
@Slf4j 
@Validated
public class DecisionCriteriaController {

    @Autowired
    private DecisionCriteriaService decisionCriteriaService;
    
    @GetMapping("/get-details")
    public ResponseEntity<DecisionCriteriaResponse> getDecisionCriteria(@ModelAttribute UserSession userSession) {
        
        log.info("Received decision criteria request for user: {} and session: {}", userSession.getUserId(), userSession.getSessionId());
        
        DecisionCriteriaResponse response = decisionCriteriaService.getDecisionCriteria(userSession.getUserId(), userSession.getSessionId());
        
        log.info("Successfully retrieved decision criteria for user: {} and session: {}", userSession.getUserId(), userSession.getSessionId());
        return ResponseEntity.ok(response);
    }
}