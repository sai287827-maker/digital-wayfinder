package com.example.DigitalWayfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.DigitalWayfinder.entity.ProjectType;
import java.util.Optional;

@Repository
public interface ProjectTypeRepository extends JpaRepository<ProjectType, Long> {
    
    // Method for upsert logic
    Optional<ProjectType> findByUserIDAndSessionID(String userID, String sessionID);

    Optional<ProjectType> findBySessionID(String sessionId);
}

