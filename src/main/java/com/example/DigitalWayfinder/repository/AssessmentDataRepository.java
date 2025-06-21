package com.example.DigitalWayfinder.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.DigitalWayfinder.entity.AssessmentData;

public interface AssessmentDataRepository extends JpaRepository<AssessmentData, Long> {

    @Query("SELECT a FROM AssessmentData a ORDER BY a.l1, a.l2, a.assetType")
    List<AssessmentData> findAllOrderedByL1AndL2();

}
