package com.example.DigitalWayfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.DigitalWayfinder.entity.WmsQuestions;
import java.util.List;

@Repository
public interface WmsQuestionsRepository extends JpaRepository<WmsQuestions, WmsQuestions.WmsQuestionsId> {
    
    // Using method name query derivation - Spring JPA will create the query automatically
    List<WmsQuestions> findByCategory(String category);
    
    @Query("SELECT w FROM WmsQuestions w ORDER BY w.category")
    List<WmsQuestions> findAllQuestions();
}