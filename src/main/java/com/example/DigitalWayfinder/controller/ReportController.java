package com.example.DigitalWayfinder.controller;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;

import com.example.DigitalWayfinder.dto.AssessmentReportDTO;
import com.example.DigitalWayfinder.service.AssessmentService;
import com.example.DigitalWayfinder.service.ExcelService;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;

@RestController
@RequestMapping("/api/digital-wayfinder/questionaire/report")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private AssessmentService assessmentService;
    
    @Autowired
    private ExcelService excelService;
    
    @GetMapping("/download-excel")
    public ResponseEntity<byte[]> downloadAssessmentReport() {
        try {
            // Fetch data from database
            List<AssessmentReportDTO> reportData = assessmentService.getAllAssessmentData();
            
            // Generate Excel file
            byte[] excelData = excelService.generateAssessmentReport(reportData);
            
            // Generate filename with timestamp
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String filename = "Assessment_Report_" + timestamp + ".xlsx";
            
            // Set response headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", filename);
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
            
            return new ResponseEntity<>(excelData, headers, HttpStatus.OK);
            
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Optional: Get data as JSON for preview
    @GetMapping("/preview")
    public ResponseEntity<List<AssessmentReportDTO>> previewAssessmentData() {
        try {
            List<AssessmentReportDTO> reportData = assessmentService.getAllAssessmentData();
            return new ResponseEntity<>(reportData, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/display")
    public ResponseEntity<Resource> displayExcel() throws IOException {
        File file = new File("src\\main\\resources\\static\\assessment-report.pdf");
        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=assessment-report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(file.length())
                .body(resource);
    }

    @PostMapping("/download")
    public ResponseEntity<byte[]> generatePdf(@RequestParam("image") MultipartFile image) {
        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            byte[] imageBytes = image.getBytes();
            Image img = new Image(ImageDataFactory.create(imageBytes));
            img.setAutoScale(true);
            document.add(img);
            document.close();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=screen.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(outputStream.toByteArray());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
