package com.example.DigitalWayfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.DigitalWayfinder.entity.TmsQuestions;
import java.util.List;

@Repository
public interface TmsQuestionsRepository extends JpaRepository<TmsQuestions, TmsQuestions.TmsQuestionsId> {
    
    // Using method name query derivation - Spring JPA will create the query automatically
    List<TmsQuestions> findByCategory(String category);
    
    @Query("SELECT t FROM TmsQuestions t ORDER BY t.category")
    List<TmsQuestions> findAllQuestions();
}