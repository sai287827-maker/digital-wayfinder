package com.example.DigitalWayfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.DigitalWayfinder.entity.FunctionalAreaDT;

import java.util.Optional;

@Repository
public interface FunctionalAreaDTRepository extends JpaRepository<FunctionalAreaDT, Long> {
    
    Optional<FunctionalAreaDT> findByUserIdAndSessionId(String userId, String sessionId);
    
    Optional<FunctionalAreaDT> findByUserIdAndSessionIdAndFunctionalArea(
            String userId, String sessionId, String functionalArea);
    
    // @Query("SELECT d FROM DWUserFunctionalArea d WHERE d.userId = :userId ORDER BY d.createdAt DESC")
    // List<FunctionalArea> findByUserIdOrderByCreatedAtDesc(@Param("userId") String userId);
}