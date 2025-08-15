package com.example.DigitalWayfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.DigitalWayfinder.entity.WmsQuestions;
import java.util.List;

@Repository
public interface WmsQuestionsWithTypeRepository extends JpaRepository<WmsQuestions, WmsQuestions.WmsQuestionsId> {
    
    List<WmsQuestions> findByCategory(String category);
    
    @Query("SELECT w FROM WmsQuestions w WHERE w.category = :category ORDER BY w.question")
    List<WmsQuestions> findByCategoryOrdered(@Param("category") String category);
    
    @Query("SELECT w FROM WmsQuestions w ORDER BY w.category, w.question")
    List<WmsQuestions> findAllOrdered();
}