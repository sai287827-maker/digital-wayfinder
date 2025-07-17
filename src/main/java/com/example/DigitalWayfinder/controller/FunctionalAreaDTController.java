package com.example.DigitalWayfinder.controller;

import com.example.DigitalWayfinder.dto.FunctionalAreaRequest;
import com.example.DigitalWayfinder.dto.FunctionalAreaResponse;
import com.example.DigitalWayfinder.dto.UserSession;
import com.example.DigitalWayfinder.entity.FunctionalAreaDT;
import com.example.DigitalWayfinder.service.FunctionalAreaDTService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/decision-tree/functional-area")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class FunctionalAreaDTController {
    
    private final FunctionalAreaDTService functionalAreaService;
    
@PostMapping("/save")
public ResponseEntity<FunctionalAreaResponse> saveFunctionalArea(
        @Valid @RequestBody FunctionalAreaRequest request,
        @ModelAttribute UserSession userSession) {

    try {

        log.info("Saving functional area '{}' for userId: {}, sessionId: {}", 
                request.getFunctionalArea(), userSession.getUserId(), userSession.getSessionId());

        FunctionalAreaResponse response = functionalAreaService
                .saveFunctionalArea(request, userSession.getUserId(), userSession.getSessionId());

        return ResponseEntity.ok(response);

    } catch (Exception e) {
        log.error("Error in saveFunctionalArea endpoint", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(FunctionalAreaResponse.builder()
                        .success(false)
                        .message("Internal server error: " + e.getMessage())
                        .build());
    }
}
    
    @GetMapping("/all")
    public ResponseEntity<List<FunctionalAreaDT>> getAllFunctionalAreas() {
        try {
            log.info("Fetching all functional areas");
            List<FunctionalAreaDT> functionalAreas = functionalAreaService.getAllFunctionalAreas();
            return ResponseEntity.ok(functionalAreas);
        } catch (Exception e) {
            log.error("Error fetching all functional areas", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}