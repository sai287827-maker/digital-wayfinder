package com.example.DigitalWayfinder.repository;

import com.example.DigitalWayfinder.entity.InScopePlatform;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InScopePlatformRepository extends JpaRepository<InScopePlatform, Integer> {
    
    List<InScopePlatform> findByFunctionalArea(String functionalArea);
    
    List<InScopePlatform> findByIndustryType(String industryType);
    
    List<InScopePlatform> findByFunctionalAreaAndIndustryType(String functionalArea, String industryType);
    
    @Query("SELECT p FROM InScopePlatform p WHERE " +
           "(:functionalArea IS NULL OR p.functionalArea = :functionalArea) AND " +
           "(:industryType IS NULL OR p.industryType = :industryType) AND " +
           "(:functionalSubArea IS NULL OR p.functionalSubArea = :functionalSubArea)")
    List<InScopePlatform> findPlatformsByFilters(@Param("functionalArea") String functionalArea,
                                               @Param("industryType") String industryType,
                                               @Param("functionalSubArea") String functionalSubArea);
}
