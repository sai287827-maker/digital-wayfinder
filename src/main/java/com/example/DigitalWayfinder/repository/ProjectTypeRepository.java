package com.example.DigitalWayfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.example.DigitalWayfinder.entity.ProjectType;
import java.util.Optional;
import java.util.List;

@Repository
public interface ProjectTypeRepository extends JpaRepository<ProjectType, Long> {
    
    // Find latest session by CreatedDate (matches your actual column name)
    @Query("SELECT p FROM ProjectType p WHERE p.createdDate = " +
           "(SELECT MAX(p2.createdDate) FROM ProjectType p2)")
    Optional<ProjectType> findLatestSession();
    
    // Alternative: Find latest session ordered by CreatedDate 
    @Query("SELECT p FROM ProjectType p ORDER BY p.createdDate DESC")
    List<ProjectType> findAllOrderByCreatedDateDesc();
    
    // Find by specific UserID and SessionID (matches your actual column names)
    Optional<ProjectType> findByUserIDAndSessionID(String userID, String sessionID);
}