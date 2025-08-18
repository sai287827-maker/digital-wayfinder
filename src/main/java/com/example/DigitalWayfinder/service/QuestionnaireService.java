package com.example.DigitalWayfinder.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.DigitalWayfinder.dto.GetAnswersResponse;
import com.example.DigitalWayfinder.dto.QuestionnaireResponse;
import com.example.DigitalWayfinder.dto.SaveAnswersRequest;
import com.example.DigitalWayfinder.dto.SaveAnswersResponse;
import com.example.DigitalWayfinder.entity.DWQuestions;
import com.example.DigitalWayfinder.entity.ProjectType;
import com.example.DigitalWayfinder.entity.TmsQuestions;
import com.example.DigitalWayfinder.entity.WmsQuestions;
import com.example.DigitalWayfinder.repository.DWQuestionsRepository;
import com.example.DigitalWayfinder.repository.ProjectTypeRepository;
import com.example.DigitalWayfinder.repository.TmsQuestionsRepository;
import com.example.DigitalWayfinder.repository.WmsQuestionsWithTypeRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuestionnaireService {
    
    private final WmsQuestionsWithTypeRepository wmsQuestionsRepository;
    private final TmsQuestionsRepository tmsQuestionsRepository;
    private final DWQuestionsRepository dwQuestionsRepository;
    private final ProjectTypeRepository projectTypeRepository;
    
    // Category constants
    private static final String CATEGORY_DATA_CLOUD = "Data & Cloud";
    private static final String CATEGORY_OPERATIONAL = "Operational Innovations";
    private static final String CATEGORY_VISIBILITY = "Visibility & Proactive Planning";
    private static final String CATEGORY_AGENTIC_AI = "Agentic AI";
    
    // =================== GET QUESTIONS METHODS ===================
    
    public QuestionnaireResponse getQuestionsByCategory(String functionalSubArea, String category, String userId, String sessionId) {
        log.info("Fetching questions for functionalSubArea: {}, category: {}, userId: {}, sessionId: {}", 
                functionalSubArea, category, userId, sessionId);
        
        try {
            String normalizedArea = normalizeQuery(functionalSubArea);
            
            QuestionnaireResponse response = QuestionnaireResponse.builder()
                    .userId(userId)
                    .sessionId(sessionId)
                    .functionalSubArea(functionalSubArea)
                    .category(category)
                    .build();
            
            List<QuestionnaireResponse.QuestionItem> questionItems;
            
            if (normalizedArea.equals("warehouse management system") || normalizedArea.equals("wms")) {
                log.info("Fetching questions from WMS table for category: {}", category);
                List<WmsQuestions> wmsQuestions = wmsQuestionsRepository.findByCategory(category);
                
                questionItems = wmsQuestions.stream()
                        .map(this::convertWmsToQuestionItem)
                        .collect(Collectors.toList());
                
                log.info("Successfully fetched {} WMS questions for category: {}", questionItems.size(), category);
                
            } else if (normalizedArea.equals("transfer management system") || 
                      normalizedArea.equals("transport management system") || 
                      normalizedArea.equals("tms")) {
                log.info("Fetching questions from TMS table for category: {}", category);
                List<TmsQuestions> tmsQuestions = tmsQuestionsRepository.findByCategory(category);
                
                questionItems = tmsQuestions.stream()
                        .map(this::convertTmsToQuestionItem)
                        .collect(Collectors.toList());
                
                log.info("Successfully fetched {} TMS questions for category: {}", questionItems.size(), category);
                
            } else {
                log.warn("Unknown functional sub area: {}", functionalSubArea);
                throw new IllegalArgumentException("Invalid functional sub area. Please specify 'Warehouse Management System' or 'Transfer Management System'");
            }
            
            response.setQuestions(questionItems);
            
            return response;
            
        } catch (IllegalArgumentException e) {
            log.error("Invalid functional sub area provided: {}", functionalSubArea);
            throw e;
        } catch (Exception e) {
            log.error("Error fetching questions for functional sub area: {} and category: {}", functionalSubArea, category, e);
            throw new RuntimeException("Failed to fetch questions: " + e.getMessage());
        }
    }
    
    // =================== GET ANSWERS METHODS ===================
    
    public GetAnswersResponse getAnswersByCategory(String category, String userId, String sessionId) {
        log.info("Fetching answers for category: {}, userId: {}, sessionId: {}", category, userId, sessionId);
        
        try {
            // Resolve the latest userId and sessionId from ProjectType table
            UserSessionInfo sessionInfo = resolveUserSession(userId, sessionId);
            
            // Fetch saved answers based on resolved session info
            List<DWQuestions> savedAnswers = dwQuestionsRepository.findAnswersByCategoryAndSession(
                    category, sessionInfo.getUserId(), sessionInfo.getSessionId());
            
            List<GetAnswersResponse.AnswerItem> answerItems = savedAnswers.stream()
                    .map(this::convertDWQuestionToAnswerItem)
                    .collect(Collectors.toList());
            
            log.info("Successfully fetched {} saved answers for category: {} with session: {}", 
                    answerItems.size(), category, sessionInfo.getSessionId());
            
            return GetAnswersResponse.builder()
                    .userId(sessionInfo.getUserId())
                    .sessionId(sessionInfo.getSessionId())
                    .functionalSubArea(savedAnswers.isEmpty() ? null : savedAnswers.get(0).getFunctionalSubArea())
                    .category(category)
                    .answersCount(answerItems.size())
                    .answers(answerItems)
                    .build();
                    
        } catch (Exception e) {
            log.error("Error fetching answers for category: {}", category, e);
            throw new RuntimeException("Failed to fetch answers: " + e.getMessage());
        }
    }
    
    // =================== SAVE ANSWERS METHODS ===================
    
    @Transactional
    public SaveAnswersResponse saveAnswers(SaveAnswersRequest request, String category, String userId, String sessionId) {
        log.info("Saving answers for category: {}, userId: {}, sessionId: {}", category, userId, sessionId);
        
        try {
            // Resolve the latest userId and sessionId from ProjectType table
            UserSessionInfo sessionInfo = resolveUserSession(userId, sessionId);
            
            List<DWQuestions> savedAnswers = new ArrayList<>();
            String functionalArea = deriveFunctionalArea(request.getFunctionalSubArea());
            
            for (SaveAnswersRequest.AnswerItem answerItem : request.getAnswers()) {
                // Check if answer already exists for this user, session, category, and question
                Optional<DWQuestions> existingAnswer = dwQuestionsRepository.findByUserIdAndSessionIdAndCategoryAndQuestion(
                        sessionInfo.getUserId(), sessionInfo.getSessionId(), category, answerItem.getQuestion());
                
                DWQuestions dwQuestion;
                if (existingAnswer.isPresent()) {
                    // Update existing answer
                    dwQuestion = existingAnswer.get();
                    dwQuestion.setResponseType(answerItem.getAnswer());
                    log.debug("Updating existing answer for question: {}", answerItem.getQuestion());
                } else {
                    // Create new answer
                    dwQuestion = DWQuestions.builder()
                            .userId(sessionInfo.getUserId())
                            .sessionId(sessionInfo.getSessionId())
                            .functionalArea(functionalArea)
                            .functionalSubArea(request.getFunctionalSubArea())
                            .category(category)
                            .question(answerItem.getQuestion())
                            .responseType(answerItem.getAnswer())
                            .build();
                    log.debug("Creating new answer for question: {}", answerItem.getQuestion());
                }
                
                savedAnswers.add(dwQuestionsRepository.save(dwQuestion));
            }
            
            log.info("Successfully saved {} answers for category: {} with session: {}", 
                    savedAnswers.size(), category, sessionInfo.getSessionId());
            
            return SaveAnswersResponse.builder()
                    .userId(sessionInfo.getUserId())
                    .sessionId(sessionInfo.getSessionId())
                    .functionalArea(functionalArea)
                    .functionalSubArea(request.getFunctionalSubArea())
                    .category(category)
                    .savedCount(savedAnswers.size())
                    .message("Answers saved successfully")
                    .build();
                    
        } catch (Exception e) {
            log.error("Error saving answers for category: {}", category, e);
            throw new RuntimeException("Failed to save answers: " + e.getMessage());
        }
    }
    
    // =================== PUBLIC API METHODS - GET QUESTIONS ===================
    
    public QuestionnaireResponse getDataCloudQuestions(String functionalSubArea, String userId, String sessionId) {
        return getQuestionsByCategory(functionalSubArea, CATEGORY_DATA_CLOUD, userId, sessionId);
    }
    
    public QuestionnaireResponse getOperationalInnovationsQuestions(String functionalSubArea, String userId, String sessionId) {
        return getQuestionsByCategory(functionalSubArea, CATEGORY_OPERATIONAL, userId, sessionId);
    }
    
    public QuestionnaireResponse getVisibilityProactiveQuestions(String functionalSubArea, String userId, String sessionId) {
        return getQuestionsByCategory(functionalSubArea, CATEGORY_VISIBILITY, userId, sessionId);
    }
    
    public QuestionnaireResponse getAgenticAIQuestions(String functionalSubArea, String userId, String sessionId) {
        return getQuestionsByCategory(functionalSubArea, CATEGORY_AGENTIC_AI, userId, sessionId);
    }
    
    // =================== PUBLIC API METHODS - GET ANSWERS ===================
    
    public GetAnswersResponse getDataCloudAnswers(String userId, String sessionId) {
        return getAnswersByCategory(CATEGORY_DATA_CLOUD, userId, sessionId);
    }
    
    public GetAnswersResponse getOperationalInnovationsAnswers(String userId, String sessionId) {
        return getAnswersByCategory(CATEGORY_OPERATIONAL, userId, sessionId);
    }
    
    public GetAnswersResponse getVisibilityProactiveAnswers(String userId, String sessionId) {
        return getAnswersByCategory(CATEGORY_VISIBILITY, userId, sessionId);
    }
    
    public GetAnswersResponse getAgenticAIAnswers(String userId, String sessionId) {
        return getAnswersByCategory(CATEGORY_AGENTIC_AI, userId, sessionId);
    }
    
    // =================== PUBLIC API METHODS - SAVE ANSWERS ===================
    
    public SaveAnswersResponse saveDataCloudAnswers(SaveAnswersRequest request, String userId, String sessionId) {
        return saveAnswers(request, CATEGORY_DATA_CLOUD, userId, sessionId);
    }
    
    public SaveAnswersResponse saveOperationalInnovationsAnswers(SaveAnswersRequest request, String userId, String sessionId) {
        return saveAnswers(request, CATEGORY_OPERATIONAL, userId, sessionId);
    }
    
    public SaveAnswersResponse saveVisibilityProactiveAnswers(SaveAnswersRequest request, String userId, String sessionId) {
        return saveAnswers(request, CATEGORY_VISIBILITY, userId, sessionId);
    }
    
    public SaveAnswersResponse saveAgenticAIAnswers(SaveAnswersRequest request, String userId, String sessionId) {
        return saveAnswers(request, CATEGORY_AGENTIC_AI, userId, sessionId);
    }
    
    // =================== HELPER METHODS ===================
    
    /**
     * Resolves the actual userId and sessionId to use.
     * Gets the latest session from ProjectType table using createdDate.
     */
    private UserSessionInfo resolveUserSession(String userId, String sessionId) {
    // If both userId and sessionId are provided, use them directly
    if (isValidString(userId) && isValidString(sessionId)) {
        log.info("Using provided session - User: {}, Session: {}", userId, sessionId);
        return new UserSessionInfo(userId, sessionId, true);
    }
    
    // Try to get the latest session from ProjectType table using createdDate
    try {
        Optional<ProjectType> latestProject = projectTypeRepository.findLatestSession();
        
        if (latestProject.isPresent()) {
            ProjectType project = latestProject.get();
            String resolvedUserId = project.getUserID();
            String resolvedSessionId = project.getSessionID();
            
            log.info("Resolved session from latest project (createdDate: {}) - User: {}, Session: {}", 
                project.getCreatedDate(), resolvedUserId, resolvedSessionId);
            
            return new UserSessionInfo(resolvedUserId, resolvedSessionId, true);
        } else {
            log.warn("No project records found to resolve session, will use null values");
            return new UserSessionInfo(null, null, true);
        }
        
    } catch (Exception e) {
        log.error("Error resolving latest session from ProjectType table", e);
        return new UserSessionInfo(null, null, true);
    }
}

private boolean isValidString(String str) {
    return str != null && !str.trim().isEmpty();
}

private String normalizeQuery(String query) {
    if (query == null) {
        return "";
    }
    return query.toLowerCase().trim();
}

private String deriveFunctionalArea(String functionalSubArea) {
    String normalized = normalizeQuery(functionalSubArea);
    
    if (normalized.contains("warehouse")) {
        return "WMS";
    } else if (normalized.contains("transfer") || normalized.contains("transport")) {
        return "TMS";
    } else if (normalized.contains("order")) {
        return "OMS";
    }
    
    // Default fallback
    return "WMS";
}

private QuestionnaireResponse.QuestionItem convertWmsToQuestionItem(WmsQuestions wms) {
    return QuestionnaireResponse.QuestionItem.builder()
            .question(wms.getQuestion())
            .answerType(wms.getAnswer())
            .build();
}

private QuestionnaireResponse.QuestionItem convertTmsToQuestionItem(TmsQuestions tms) {
    return QuestionnaireResponse.QuestionItem.builder()
            .question(tms.getQuestion())
            .answerType(tms.getAnswer())
            .build();
}

private GetAnswersResponse.AnswerItem convertDWQuestionToAnswerItem(DWQuestions dwQuestion) {
    return GetAnswersResponse.AnswerItem.builder()
            .question(dwQuestion.getQuestion())
            .answer(dwQuestion.getResponseType())  // The user's saved response (low, medium, high)
            .build();
}

// Helper class to hold session resolution result
private static class UserSessionInfo {
    private final String userId;
    private final String sessionId;
    private final boolean valid;
    
    public UserSessionInfo(String userId, String sessionId, boolean valid) {
        this.userId = userId;
        this.sessionId = sessionId;
        this.valid = valid;
    }
    
    public String getUserId() { return userId; }
    public String getSessionId() { return sessionId; }
    public boolean isValid() { return valid; }
}
}