package com.example.DigitalWayfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.DigitalWayfinder.entity.ReportDownloadEntity;
import java.util.List;

@Repository
public interface ReportDownloadRepository extends JpaRepository<ReportDownloadEntity, Long> {
    
    // Get all records with proper column names
    @Query(value = "SELECT ID, [Asset Name], Category, Gaps, L2, SessionID, UserID " +
                   "FROM vw_Fnl_FunctionScore_WMS " +
                   "ORDER BY Category, [Asset Name]", 
           nativeQuery = true)
    List<Object[]> findAllReportData();
    
    // Get records by category
    @Query(value = "SELECT ID, [Asset Name], Category, Gaps, L2, SessionID, UserID " +
                   "FROM vw_Fnl_FunctionScore_WMS " +
                   "WHERE Category = ?1 " +
                   "ORDER BY [Asset Name]", 
           nativeQuery = true)
    List<Object[]> findReportDataByCategory(String category);
    
    // Get records filtered by UserID and SessionID (including nulls)
    @Query(value = "SELECT ID, [Asset Name], Category, Gaps, L2, SessionID, UserID " +
                   "FROM vw_Fnl_FunctionScore_WMS " +
                   "WHERE (UserID = :userID OR UserID IS NULL) AND " +
                   "(SessionID = :sessionID OR SessionID IS NULL) " +
                   "ORDER BY Category, [Asset Name]", 
           nativeQuery = true)
    List<Object[]> findReportDataByUserAndSession(@Param("userID") String userID, 
                                                  @Param("sessionID") String sessionID);
    
    // Get records by category, UserID and SessionID (including nulls)
    @Query(value = "SELECT ID, [Asset Name], Category, Gaps, L2, SessionID, UserID " +
                   "FROM vw_Fnl_FunctionScore_WMS " +
                   "WHERE Category = :category AND " +
                   "(UserID = :userID OR UserID IS NULL) AND " +
                   "(SessionID = :sessionID OR SessionID IS NULL) " +
                   "ORDER BY [Asset Name]", 
           nativeQuery = true)
    List<Object[]> findReportDataByCategoryUserAndSession(@Param("category") String category,
                                                          @Param("userID") String userID, 
                                                          @Param("sessionID") String sessionID);
}