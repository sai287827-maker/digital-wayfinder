package com.example.DigitalWayfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.DigitalWayfinder.entity.DWQuestions;
import java.util.List;
import java.util.Optional;

@Repository
public interface DWQuestionsRepository extends JpaRepository<DWQuestions, Long> {
    
    Optional<DWQuestions> findByUserIdAndSessionIdAndCategoryAndQuestion(
            String userId, String sessionId, String category, String question);
    
    List<DWQuestions> findByUserIdAndSessionIdAndCategory(
            String userId, String sessionId, String category);
    
    @Query("DELETE FROM DWQuestions d WHERE d.userId = :userId AND d.sessionId = :sessionId AND d.category = :category")
    void deleteByUserIdAndSessionIdAndCategory(
            @Param("userId") String userId, 
            @Param("sessionId") String sessionId, 
            @Param("category") String category);
    
    // Find answers by category for resolved session (including null sessions)
    @Query("SELECT d FROM DWQuestions d WHERE d.category = :category AND " +
           "(d.userId = :userId OR d.userId IS NULL) AND " +
           "(d.sessionId = :sessionId OR d.sessionId IS NULL)")
    List<DWQuestions> findAnswersByCategoryAndSession(@Param("category") String category,
                                                      @Param("userId") String userId, 
                                                      @Param("sessionId") String sessionId);
}