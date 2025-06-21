package com.example.DigitalWayfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.DigitalWayfinder.entity.FunctionalArea;
import com.itextpdf.layout.element.List;

import java.util.Optional;

@Repository
public interface FunctionalAreaRepository extends JpaRepository<FunctionalArea, Long> {
    
    List<FunctionalArea> findByUserIdAndSessionId(String userId, String sessionId);
    
    Optional<FunctionalArea> findByUserIdAndSessionIdAndFunctionalArea(
            String userId, String sessionId, String functionalArea);
    
    // @Query("SELECT d FROM DWUserFunctionalArea d WHERE d.userId = :userId ORDER BY d.createdAt DESC")
    // List<FunctionalArea> findByUserIdOrderByCreatedAtDesc(@Param("userId") String userId);
}