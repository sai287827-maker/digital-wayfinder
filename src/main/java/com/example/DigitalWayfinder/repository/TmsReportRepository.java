package com.example.DigitalWayfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.DigitalWayfinder.entity.TmsReport;
import java.util.List;

@Repository
public interface TmsReportRepository extends JpaRepository<TmsReport, Long> {
    
    // Get all records
    List<TmsReport> findAll();
    
    // Filter by category if needed
    List<TmsReport> findByCategory(String category);
    
    // Filter by gaps (non-null values)
    @Query("SELECT p FROM TmsReport p WHERE p.gaps IS NOT NULL")
    List<TmsReport> findAllWithGaps();
    
    // Custom query to get distinct categories
    @Query("SELECT DISTINCT p.category FROM TmsReport p")
    List<String> findDistinctCategories();
    
    // Find by UserID and SessionID (exact match)
    List<TmsReport> findByUserIDAndSessionID(String userID, String sessionID);
    
    // Find by category and UserID and SessionID
    List<TmsReport> findByCategoryAndUserIDAndSessionID(String category, String userID, String sessionID);
    
    // Find by UserID and SessionID (including null values)
    // This will return records that either match the provided userID/sessionID OR have null userID/sessionID
    @Query("SELECT p FROM TmsReport p WHERE " +
           "(p.userID = :userID OR p.userID IS NULL) AND " +
           "(p.sessionID = :sessionID OR p.sessionID IS NULL)")
    List<TmsReport> findByUserIDAndSessionIDIncludingNulls(@Param("userID") String userID, 
                                                                  @Param("sessionID") String sessionID);
    
    // Find by category, UserID and SessionID (including null values)
    @Query("SELECT p FROM TmsReport p WHERE p.category = :category AND " +
           "(p.userID = :userID OR p.userID IS NULL) AND " +
           "(p.sessionID = :sessionID OR p.sessionID IS NULL)")
    List<TmsReport> findByCategoryAndUserIDAndSessionIDIncludingNulls(@Param("category") String category,
                                                                             @Param("userID") String userID, 
                                                                             @Param("sessionID") String sessionID);
}