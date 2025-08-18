package com.example.DigitalWayfinder.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.DigitalWayfinder.dto.GetAnswersResponse;
import com.example.DigitalWayfinder.dto.QuestionnaireResponse;
import com.example.DigitalWayfinder.dto.SaveAnswersRequest;
import com.example.DigitalWayfinder.dto.SaveAnswersResponse;
import com.example.DigitalWayfinder.dto.UserSession;
import com.example.DigitalWayfinder.service.QuestionnaireService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

@RestController
@RequestMapping("api/digital-wayfinder/questionnaire")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class QuestionnaireController {
    
    private final QuestionnaireService questionnaireService;
    
    // =================== GET QUESTIONS APIs ===================
    
    @GetMapping("/data-cloud/get-questions")
    public ResponseEntity<QuestionnaireResponse> getDataCloudQuestions(
            @RequestParam @NotBlank(message = "functionalSubArea is required") String functionalSubArea,
            @ModelAttribute UserSession userSession) {
        
        log.info("Received request for Data & Cloud questions - functionalSubArea: {}, user: {}, session: {}", 
                functionalSubArea, userSession.getUserId(), userSession.getSessionId());
        
        try {
            QuestionnaireResponse response = questionnaireService.getDataCloudQuestions(
                    functionalSubArea, 
                    userSession.getUserId(), 
                    userSession.getSessionId()
            );
            
            log.info("Successfully returning questions for functionalSubArea: {}", functionalSubArea);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            log.error("Invalid functionalSubArea provided: {}", functionalSubArea);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error fetching Data & Cloud questions for functionalSubArea: {}", functionalSubArea, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/operational-innovations/get-questions")
    public ResponseEntity<QuestionnaireResponse> getOperationalInnovationsQuestions(
            @RequestParam @NotBlank(message = "functionalSubArea is required") String functionalSubArea,
            @ModelAttribute UserSession userSession) {
        
        log.info("Received request for Operational Innovations questions - functionalSubArea: {}, user: {}, session: {}", 
                functionalSubArea, userSession.getUserId(), userSession.getSessionId());
        
        try {
            QuestionnaireResponse response = questionnaireService.getOperationalInnovationsQuestions(
                    functionalSubArea, 
                    userSession.getUserId(), 
                    userSession.getSessionId()
            );
            
            log.info("Successfully returning questions for functionalSubArea: {}", functionalSubArea);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            log.error("Invalid functionalSubArea provided: {}", functionalSubArea);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error fetching Operational Innovations questions for functionalSubArea: {}", functionalSubArea, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/visibility-proactive/get-questions")
    public ResponseEntity<QuestionnaireResponse> getVisibilityProactiveQuestions(
            @RequestParam @NotBlank(message = "functionalSubArea is required") String functionalSubArea,
            @ModelAttribute UserSession userSession) {
        
        log.info("Received request for Visibility & Proactive Planning questions - functionalSubArea: {}, user: {}, session: {}", 
                functionalSubArea, userSession.getUserId(), userSession.getSessionId());
        
        try {
            QuestionnaireResponse response = questionnaireService.getVisibilityProactiveQuestions(
                    functionalSubArea, 
                    userSession.getUserId(), 
                    userSession.getSessionId()
            );
            
            log.info("Successfully returning questions for functionalSubArea: {}", functionalSubArea);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            log.error("Invalid functionalSubArea provided: {}", functionalSubArea);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error fetching Visibility & Proactive Planning questions for functionalSubArea: {}", functionalSubArea, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/genai/get-questions")
    public ResponseEntity<QuestionnaireResponse> getGenAIQuestions(
            @RequestParam @NotBlank(message = "functionalSubArea is required") String functionalSubArea,
            @ModelAttribute UserSession userSession) {
        
        log.info("Received request for Agentic AI questions - functionalSubArea: {}, user: {}, session: {}", 
                functionalSubArea, userSession.getUserId(), userSession.getSessionId());
        
        try {
            QuestionnaireResponse response = questionnaireService.getAgenticAIQuestions(
                    functionalSubArea, 
                    userSession.getUserId(), 
                    userSession.getSessionId()
            );
            
            log.info("Successfully returning questions for functionalSubArea: {}", functionalSubArea);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            log.error("Invalid functionalSubArea provided: {}", functionalSubArea);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error fetching Agentic AI questions for functionalSubArea: {}", functionalSubArea, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // =================== GET ANSWERS APIs ===================
    
    @GetMapping("/data-cloud/get-answers")
    public ResponseEntity<GetAnswersResponse> getDataCloudAnswers(
            @ModelAttribute UserSession userSession) {
        
        log.info("Received request for Data & Cloud answers - user: {}, session: {}", 
                userSession.getUserId(), userSession.getSessionId());
        
        try {
            GetAnswersResponse response = questionnaireService.getDataCloudAnswers(
                    userSession.getUserId(), 
                    userSession.getSessionId()
            );
            
            log.info("Successfully returning {} Data & Cloud answers", response.getAnswersCount());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error fetching Data & Cloud answers", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/operational-innovations/get-answers")
    public ResponseEntity<GetAnswersResponse> getOperationalInnovationsAnswers(
            @ModelAttribute UserSession userSession) {
        
        log.info("Received request for Operational Innovations answers - user: {}, session: {}", 
                userSession.getUserId(), userSession.getSessionId());
        
        try {
            GetAnswersResponse response = questionnaireService.getOperationalInnovationsAnswers(
                    userSession.getUserId(), 
                    userSession.getSessionId()
            );
            
            log.info("Successfully returning {} Operational Innovations answers", response.getAnswersCount());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error fetching Operational Innovations answers", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/visibility-proactive/get-answers")
    public ResponseEntity<GetAnswersResponse> getVisibilityProactiveAnswers(
            @ModelAttribute UserSession userSession) {
        
        log.info("Received request for Visibility & Proactive Planning answers - user: {}, session: {}", 
                userSession.getUserId(), userSession.getSessionId());
        
        try {
            GetAnswersResponse response = questionnaireService.getVisibilityProactiveAnswers(
                    userSession.getUserId(), 
                    userSession.getSessionId()
            );
            
            log.info("Successfully returning {} Visibility & Proactive Planning answers", response.getAnswersCount());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error fetching Visibility & Proactive Planning answers", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/genai/get-answers")
    public ResponseEntity<GetAnswersResponse> getGenAIAnswers(
            @ModelAttribute UserSession userSession) {
        
        log.info("Received request for Agentic AI answers - user: {}, session: {}", 
                userSession.getUserId(), userSession.getSessionId());
        
        try {
            GetAnswersResponse response = questionnaireService.getAgenticAIAnswers(
                    userSession.getUserId(), 
                    userSession.getSessionId()
            );
            
            log.info("Successfully returning {} Agentic AI answers", response.getAnswersCount());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error fetching Agentic AI answers", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // =================== SAVE ANSWERS APIs ===================

    @PostMapping("/data-cloud/save-answers")
    public ResponseEntity<SaveAnswersResponse> saveDataCloudAnswers(
            @Valid @RequestBody SaveAnswersRequest request,
            @ModelAttribute UserSession userSession) {
        
        log.info("Received request to save Data & Cloud answers - user: {}, session: {}", 
                userSession.getUserId(), userSession.getSessionId());
        
        try {
            SaveAnswersResponse response = questionnaireService.saveDataCloudAnswers(
                    request, 
                    userSession.getUserId(), 
                    userSession.getSessionId()
            );
            
            log.info("Successfully saved {} Data & Cloud answers", response.getSavedCount());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            log.error("Error saving Data & Cloud answers", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/operational-innovations/save-answers")
    public ResponseEntity<SaveAnswersResponse> saveOperationalInnovationsAnswers(
            @Valid @RequestBody SaveAnswersRequest request,
            @ModelAttribute UserSession userSession) {
        
        log.info("Received request to save Operational Innovations answers - user: {}, session: {}", 
                userSession.getUserId(), userSession.getSessionId());
        
        try {
            SaveAnswersResponse response = questionnaireService.saveOperationalInnovationsAnswers(
                    request, 
                    userSession.getUserId(), 
                    userSession.getSessionId()
            );
            
            log.info("Successfully saved {} Operational Innovations answers", response.getSavedCount());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            log.error("Error saving Operational Innovations answers", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/visibility-proactive/save-answers")
    public ResponseEntity<SaveAnswersResponse> saveVisibilityProactiveAnswers(
            @Valid @RequestBody SaveAnswersRequest request,
            @ModelAttribute UserSession userSession) {
        
        log.info("Received request to save Visibility & Proactive Planning answers - user: {}, session: {}", 
                userSession.getUserId(), userSession.getSessionId());
        
        try {
            SaveAnswersResponse response = questionnaireService.saveVisibilityProactiveAnswers(
                    request, 
                    userSession.getUserId(), 
                    userSession.getSessionId()
            );
            
            log.info("Successfully saved {} Visibility & Proactive Planning answers", response.getSavedCount());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            log.error("Error saving Visibility & Proactive Planning answers", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/genai/save-answers")
    public ResponseEntity<SaveAnswersResponse> saveGenAIAnswers(
            @Valid @RequestBody SaveAnswersRequest request,
            @ModelAttribute UserSession userSession) {
        
        log.info("Received request to save Agentic AI answers - user: {}, session: {}", 
                userSession.getUserId(), userSession.getSessionId());
        
        try {
            SaveAnswersResponse response = questionnaireService.saveAgenticAIAnswers(
                    request, 
                    userSession.getUserId(), 
                    userSession.getSessionId()
            );
            
            log.info("Successfully saved {} Agentic AI answers", response.getSavedCount());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            log.error("Error saving Agentic AI answers", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}