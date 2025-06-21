package com.example.DigitalWayfinder.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.example.DigitalWayfinder.dto.IndustryTypeRequest;
import com.example.DigitalWayfinder.dto.IndustryTypeResponse;
import com.example.DigitalWayfinder.entity.FunctionalArea;
import com.example.DigitalWayfinder.repository.FunctionalAreaRepository;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Slf4j
public class IndustryTypeService {

    private final FunctionalAreaRepository repository;

    public IndustryTypeResponse saveIndustryType(IndustryTypeRequest request, String userId, String sessionId) {
        log.info("Updating industryType for userId={}, sessionId={}", userId, sessionId);

        FunctionalArea existing = repository.findByUserIdAndSessionId(userId, sessionId)
                .orElseThrow(() -> new NoSuchElementException("FunctionalArea not found for user and session"));

        existing.setIndustryType(request.getIndustryType());
        repository.save(existing);

        return IndustryTypeResponse.builder()
                .userId(userId)
                .sessionId(sessionId)
                .industryType(request.getIndustryType())
                .message("Industry Type saved successfully")
                .build();
    }
}
