package com.example.DigitalWayfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.DigitalWayfinder.entity.PlanningQuestions;
import java.util.List;

@Repository
public interface PlanningQuestionsRepository extends JpaRepository<PlanningQuestions, PlanningQuestions.PlanningQuestionsId> {
    
    List<PlanningQuestions> findByCategory(String category);
    
    @Query("SELECT w FROM PlanningQuestions w WHERE w.category = :category ORDER BY w.question")
    List<PlanningQuestions> findByCategoryOrdered(@Param("category") String category);
    
    @Query("SELECT w FROM PlanningQuestions w ORDER BY w.category, w.question")
    List<PlanningQuestions> findAllOrdered();
}