package com.example.DigitalWayfinder.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.DigitalWayfinder.dto.UserSession;
import com.example.DigitalWayfinder.service.ReportDownloadService;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("api/digital-wayfinder/questionnaire/report")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ReportDownloadController {
    
    private final ReportDownloadService reportDownloadService;
    
    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadReport(@ModelAttribute UserSession userSession) {
        
        log.info("Received request to download report - user: {}, session: {}", 
                userSession.getUserId(), userSession.getSessionId());
        
        try {
            // Generate PDF
            byte[] pdfContent = reportDownloadService.generatePdfReport(
                    userSession.getUserId(), 
                    userSession.getSessionId()
            );
            
            // Generate filename with timestamp
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String filename = String.format("DigitalWayfinder_Report_%s.pdf", timestamp);
            
            // Set headers for file download
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", filename);
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
            
            log.info("Successfully generated PDF report for download");
            
            return new ResponseEntity<>(pdfContent, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            log.error("Error generating PDF report for download", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
