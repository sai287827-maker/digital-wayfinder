package com.example.DigitalWayfinder.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.DigitalWayfinder.dto.QuestionnaireResponse;
import com.example.DigitalWayfinder.dto.SaveAnswersRequest;
import com.example.DigitalWayfinder.dto.SaveAnswersResponse;
import com.example.DigitalWayfinder.entity.WmsQuestions;
import com.example.DigitalWayfinder.entity.TmsQuestions;
import com.example.DigitalWayfinder.entity.DWQuestions;
import com.example.DigitalWayfinder.repository.WmsQuestionsRepository;
import com.example.DigitalWayfinder.repository.TmsQuestionsRepository;
import com.example.DigitalWayfinder.repository.DWQuestionsRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuestionnaireService {
    
    private final WmsQuestionsRepository wmsQuestionsRepository;
    private final TmsQuestionsRepository tmsQuestionsRepository;
    private final DWQuestionsRepository dwQuestionsRepository;
    
    // Category constants
    private static final String CATEGORY_DATA_CLOUD = "Data & Cloud";
    private static final String CATEGORY_OPERATIONAL = "Operational Innovations";
    private static final String CATEGORY_VISIBILITY = "Visibility & Proactive Planning";
    private static final String CATEGORY_AGENTIC_AI = "Agentic AI";
    
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
    
    @Transactional
    public SaveAnswersResponse saveAnswers(SaveAnswersRequest request, String category, String userId, String sessionId) {
        log.info("Saving answers for category: {}, userId: {}, sessionId: {}", category, userId, sessionId);
        
        try {
            List<DWQuestions> savedAnswers = new ArrayList<>();
            
            for (SaveAnswersRequest.AnswerItem answerItem : request.getAnswers()) {
                // Check if answer already exists for this user, session, category, and question
                Optional<DWQuestions> existingAnswer = dwQuestionsRepository.findByUserIdAndSessionIdAndCategoryAndQuestion(
                        userId, sessionId, category, answerItem.getQuestion());
                
                DWQuestions dwQuestion;
                if (existingAnswer.isPresent()) {
                    // Update existing answer
                    dwQuestion = existingAnswer.get();
                    dwQuestion.setResponseType(answerItem.getAnswer());
                    log.debug("Updating existing answer for question: {}", answerItem.getQuestion());
                } else {
                    // Create new answer
                    dwQuestion = DWQuestions.builder()
                            .userId(userId)
                            .sessionId(sessionId)
                            .functionalArea(request.getFunctionalArea())
                            .functionalSubArea(request.getFunctionalSubArea())
                            .category(category)
                            .question(answerItem.getQuestion())
                            .responseType(answerItem.getAnswer())
                            .build();
                    log.debug("Creating new answer for question: {}", answerItem.getQuestion());
                }
                
                savedAnswers.add(dwQuestionsRepository.save(dwQuestion));
            }
            
            log.info("Successfully saved {} answers for category: {}", savedAnswers.size(), category);
            
            return SaveAnswersResponse.builder()
                    .userId(userId)
                    .sessionId(sessionId)
                    .functionalArea(request.getFunctionalArea())
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
    
    // Service methods for each category - GET
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
    
    // Service methods for each category - POST (Save)
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
    
    private String normalizeQuery(String query) {
        if (query == null) {
            return "";
        }
        return query.toLowerCase().trim();
    }
    
    private QuestionnaireResponse.QuestionItem convertWmsToQuestionItem(WmsQuestions wms) {
        return QuestionnaireResponse.QuestionItem.builder()
                .question(wms.getQuestion())
                .build();
    }
    
    private QuestionnaireResponse.QuestionItem convertTmsToQuestionItem(TmsQuestions tms) {
        return QuestionnaireResponse.QuestionItem.builder()
                .question(tms.getQuestion())
                .build();
    }
}