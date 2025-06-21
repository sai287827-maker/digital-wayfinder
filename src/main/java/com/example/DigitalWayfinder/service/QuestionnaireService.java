package com.example.DigitalWayfinder.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.DigitalWayfinder.dto.DataCloudRequest;


@Service
public class QuestionnaireService {

    private final Map<String, String> responses = new HashMap<>();

    public Map<String, String> saveResponses(DataCloudRequest request) {
        responses.put("cloudUsage", request.getCloudUsage());
        responses.put("realTimeIntegration", request.getRealTimeIntegration());
        responses.put("unifiedDataModel", request.getUnifiedDataModel());
        responses.put("externalIntegration", request.getExternalIntegration());

        return Map.of("status", "success", "message", "Responses recorded");
    }

}
