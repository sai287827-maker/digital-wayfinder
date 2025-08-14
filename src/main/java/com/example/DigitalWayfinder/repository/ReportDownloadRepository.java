package com.example.DigitalWayfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.DigitalWayfinder.entity.ReportDownloadEntity;
import java.util.List;

@Repository
public interface ReportDownloadRepository extends JpaRepository<ReportDownloadEntity, Long> {
    
    @Query(value = "SELECT id, [Assert Name] as assetName, Category, Gaps, L2 " +
                   "FROM vw_Fnl_FunctionScore_WMS " +
                   "ORDER BY Category, [Assert Name]", 
           nativeQuery = true)
    List<Object[]> findAllReportData();
    
    @Query(value = "SELECT id, [Assert Name] as assetName, Category, Gaps, L2 " +
                   "FROM vw_Fnl_FunctionScore_WMS " +
                   "WHERE Category = ?1 " +
                   "ORDER BY [Assert Name]", 
           nativeQuery = true)
    List<Object[]> findReportDataByCategory(String category);
}
