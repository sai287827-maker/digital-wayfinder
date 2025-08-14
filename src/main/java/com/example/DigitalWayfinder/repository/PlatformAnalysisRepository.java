package com.example.DigitalWayfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.DigitalWayfinder.entity.PlatformAnalysis;
import java.util.List;

@Repository
public interface PlatformAnalysisRepository extends JpaRepository<PlatformAnalysis, Long> {
    
    // Get all records
    List<PlatformAnalysis> findAll();
    
    // Filter by category if needed
    List<PlatformAnalysis> findByCategory(String category);
    
    // Filter by gaps (non-null values)
    @Query("SELECT p FROM PlatformAnalysis p WHERE p.gaps IS NOT NULL")
    List<PlatformAnalysis> findAllWithGaps();
    
    // Custom query to get distinct categories
    @Query("SELECT DISTINCT p.category FROM PlatformAnalysis p")
    List<String> findDistinctCategories();
}