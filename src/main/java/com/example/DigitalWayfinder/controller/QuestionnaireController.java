/*package com.example.DigitalWayfinder.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.DigitalWayfinder.dto.DataCloudRequest;
import com.example.DigitalWayfinder.service.QuestionnaireService;

@RestController
@RequestMapping("/api/questionnaire")
public class QuestionnaireController {

    @Autowired QuestionnaireService dataCloudService;
    @PostMapping("/data-cloud")
    public Map<String, String> submitResponses(@RequestBody DataCloudRequest request) {
        return dataCloudService.saveResponses(request);
    }

    @PostMapping("/operational-innovations")
    public Map<String, String> submitResponses(@RequestBody OpInnovatn request) {
        return dataCloudService.saveResponses(request);
    }

    @PostMapping("/visibility-proactive")
    public Map<String, String> submitResponses(@RequestBody VisbProact request) {
        return dataCloudService.saveResponses(request);
    }

    @PostMapping("/generative-ai")
    public Map<String, String> submitResponses(@RequestBody GebAI request) {
        return dataCloudService.saveResponses(request);
    }

}
*/