package com.example.DigitalWayfinder.service;

import org.springframework.stereotype.Service;

import com.example.DigitalWayfinder.dto.AssessmentReportDTO;
import com.example.DigitalWayfinder.entity.AssessmentData;
import com.example.DigitalWayfinder.repository.AssessmentDataRepository;

import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssessmentService {
    
    @Autowired
    private AssessmentDataRepository assessmentDataRepository;
    
    public List<AssessmentReportDTO> getAllAssessmentData() {
        // Use the ordered query to ensure proper grouping for L1 merging
        List<AssessmentData> entities = assessmentDataRepository.findAllOrderedByL1AndL2();
        
        return entities.stream()
                .map(entity -> new AssessmentReportDTO(
                        entity.getL1(),
                        entity.getL2(),
                        entity.getAssetType(),
                        entity.getAssetName(),
                        entity.getAssetReference()
                ))
                .collect(Collectors.toList());
    }
}
