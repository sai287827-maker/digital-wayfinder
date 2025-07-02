package com.example.DigitalWayfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.DigitalWayfinder.entity.WmsFunctional;

import java.util.List;

@Repository
public interface OmsFunctionalRepository extends JpaRepository<WmsFunctional, Long> {
    
    @Query(value = "SELECT L1, L2, L3, L4 FROM Retail", nativeQuery = true)
    List<Object[]> findAllLevelsAsArray();

    @Query("SELECT DISTINCT w.l1 FROM RetailFunctional w WHERE w.l1 IS NOT NULL AND w.l1 != ''")
    List<String> findDistinctL1();
    
    @Query("SELECT DISTINCT w.l2 FROM RetailFunctional w WHERE w.l1 = :l1 AND w.l2 IS NOT NULL AND w.l2 != ''")
    List<String> findDistinctL2ByL1(@Param("l1") String l1);
    
    @Query("SELECT DISTINCT w.l3 FROM RetailFunctional w WHERE w.l1 = :l1 AND w.l2 = :l2 AND w.l3 IS NOT NULL AND w.l3 != ''")
    List<String> findDistinctL3ByL1AndL2(@Param("l1") String l1, @Param("l2") String l2);
    
    @Query("SELECT DISTINCT w.l4 FROM RetailFunctional w WHERE w.l1 = :l1 AND w.l2 = :l2 AND w.l3 = :l3 AND w.l4 IS NOT NULL AND w.l4 != ''")
    List<String> findDistinctL4ByL1AndL2AndL3(@Param("l1") String l1, @Param("l2") String l2, @Param("l3") String l3);
}