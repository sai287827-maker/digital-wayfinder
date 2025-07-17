package com.example.DigitalWayfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.DigitalWayfinder.entity.FunctionalAreaDW;

import java.util.Optional;

@Repository
public interface FunctionalAreaDWRepository extends JpaRepository<FunctionalAreaDW, Long> {
    
    Optional<FunctionalAreaDW> findByUserIdAndSessionId(String userId, String sessionId);
    
    Optional<FunctionalAreaDW> findByUserIdAndSessionIdAndFunctionalArea(
            String userId, String sessionId, String functionalArea);
    
    // @Query("SELECT d FROM DWUserFunctionalArea d WHERE d.userId = :userId ORDER BY d.createdAt DESC")
    // List<FunctionalArea> findByUserIdOrderByCreatedAtDesc(@Param("userId") String userId);
}