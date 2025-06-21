package com.example.DigitalWayfinder.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.DigitalWayfinder.dto.ProjectInfoRequest;
import com.example.DigitalWayfinder.dto.ProjectInfoResponse;
import com.example.DigitalWayfinder.dto.UserSession;
import com.example.DigitalWayfinder.entity.ProjectType;
import com.example.DigitalWayfinder.service.ProjectInfoService;

import java.util.List;

@RestController
@RequestMapping("api/decision-tree/wms-system")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class ProjectInfoController {
    
    private final ProjectInfoService projectInfoService;
    
    @PostMapping("/save")
    public ResponseEntity<ProjectInfoResponse> saveProjectInfo(
            @Valid @RequestBody ProjectInfoRequest request,
            @ModelAttribute UserSession userSession) {
        try {
            
            log.info("Received request to save project info: {} for user: {} in session: {}", 
                    request.getRequestID(), userSession.getUserId(), userSession.getSessionId());
            
            ProjectInfoResponse response = projectInfoService.saveOrUpdateProjectInfo(request, userSession.getUserId(), userSession.getSessionId());            
            
            if (response.isSuccess()) {
                // Use OK status for updates, CREATED for new records
                HttpStatus status = response.isUpdated() ? HttpStatus.OK : HttpStatus.CREATED;
                return ResponseEntity.status(status).body(response);            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (Exception e) {
            log.error("Error in saveProjectInfo endpoint: {}", e.getMessage(), e);
            ProjectInfoResponse errorResponse = ProjectInfoResponse.error("Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<ProjectType>> getAllProjects() {
        log.info("Received request to get all projects");
        
        List<ProjectType> projects = projectInfoService.getAllProjects();
        log.info("Found {} projects in total", projects.size());
        
        return ResponseEntity.ok(projects);
    }
}