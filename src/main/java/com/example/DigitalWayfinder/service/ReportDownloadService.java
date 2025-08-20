package com.example.DigitalWayfinder.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.example.DigitalWayfinder.dto.ReportDownloadDto;
import com.example.DigitalWayfinder.entity.ProjectType;
import com.example.DigitalWayfinder.repository.ProjectTypeRepository;
import com.example.DigitalWayfinder.repository.ReportDownloadRepository;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.io.font.constants.StandardFonts;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportDownloadService {
    
    private final ReportDownloadRepository reportDownloadRepository;
    private final ProjectTypeRepository projectTypeRepository;
    
    public byte[] generatePdfReport(String userId, String sessionId) {
        log.info("Generating PDF report for user: {}, session: {}", userId, sessionId);
        
        try {
            // Step 1: Resolve the latest userId and sessionId from ProjectType table
            UserSessionInfo sessionInfo = resolveUserSession(userId, sessionId);
            
            // Step 2: Fetch ONLY records that match the latest session OR have null session info
            List<Object[]> rawData = reportDownloadRepository.findReportDataByUserAndSession(
                    sessionInfo.getUserId(), sessionInfo.getSessionId());
            
            List<ReportDownloadDto> reportData = new ArrayList<>();
            
            // Convert raw data to DTOs
            // Query returns: ID, [Asset Name], Category, Gaps, L2, SessionID, UserID
            for (Object[] row : rawData) {
                ReportDownloadDto dto = ReportDownloadDto.builder()
                        .assetName(row[1] != null ? row[1].toString() : null)  // Asset Name
                        .category(row[2] != null ? row[2].toString() : null)   // Category
                        .gaps(row[3] != null ? row[3].toString() : null)       // Gaps
                        .build();
                reportData.add(dto);
            }
            
            log.info("Fetched {} records from database for user: {}, session: {}", 
                    reportData.size(), sessionInfo.getUserId(), sessionInfo.getSessionId());
            
            // Step 3: Remove duplicates and filter out null asset names
            List<ReportDownloadDto> cleanedData = removeDuplicatesAndFilterNulls(reportData);
            
            log.info("After deduplication and filtering: {} records remaining (removed {} duplicates/null entries)", 
                    cleanedData.size(), reportData.size() - cleanedData.size());
            
            // Generate PDF with cleaned data
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
            
            // Add fonts
            PdfFont font = PdfFontFactory.createFont(StandardFonts.HELVETICA);
            PdfFont boldFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
            
            // Add title
            Paragraph title = new Paragraph("Digital Wayfinder Report")
                    .setFont(boldFont)
                    .setFontSize(18)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(10);
            document.add(title);
            
            // Add metadata (only generation timestamp)
            Paragraph metadata = new Paragraph()
                    .add("Generated on: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                    .setFont(font)
                    .setFontSize(10)
                    .setMarginBottom(20);
            document.add(metadata);
            
            // Add summary with cleaned data count
            Paragraph summary = new Paragraph("Total Records: " + cleanedData.size())
                    .setFont(font)
                    .setFontSize(12)
                    .setMarginBottom(10);
            document.add(summary);
            
            // Create table with 3 columns
            Table table = new Table(new float[]{3, 2, 2});
            table.setWidth(UnitValue.createPercentValue(100));
            
            // Add table headers
            table.addHeaderCell(createHeaderCell("Asset Name", boldFont));
            table.addHeaderCell(createHeaderCell("Category", boldFont));
            table.addHeaderCell(createHeaderCell("Gaps", boldFont));
            
            // Add data rows using cleaned data
            for (ReportDownloadDto dto : cleanedData) {
                table.addCell(createDataCell(dto.getAssetName() != null ? dto.getAssetName() : "N/A", font));
                table.addCell(createDataCell(dto.getCategory() != null ? dto.getCategory() : "N/A", font));
                table.addCell(createDataCell(dto.getGaps() != null ? dto.getGaps() : "N/A", font));
            }
            
            document.add(table);
            
            // Add footer
            Paragraph footer = new Paragraph("--- End of Report ---")
                    .setFont(font)
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(20);
            document.add(footer);
            
            // Close document
            document.close();
            
            log.info("Successfully generated PDF report with {} cleaned records", cleanedData.size());
            return baos.toByteArray();
            
        } catch (Exception e) {
            log.error("Error generating PDF report", e);
            throw new RuntimeException("Failed to generate PDF report: " + e.getMessage());
        }
    }
    
    /**
     * Removes duplicate records and filters out records with null or empty asset names.
     * Uses assetName, category, and gaps combination as the unique key.
     */
    private List<ReportDownloadDto> removeDuplicatesAndFilterNulls(List<ReportDownloadDto> reportData) {
        return reportData.stream()
                // Filter out records where assetName is null or empty
                .filter(dto -> dto.getAssetName() != null && !dto.getAssetName().trim().isEmpty())
                .collect(Collectors.toMap(
                    // Key: Create a unique key based on assetName, category, and gaps
                    dto -> createUniqueKey(dto.getAssetName(), dto.getCategory(), dto.getGaps()),
                    // Value: The DTO itself
                    dto -> dto,
                    // Merge function: Keep the first occurrence in case of duplicates
                    (existing, replacement) -> existing
                ))
                .values()
                .stream()
                .collect(Collectors.toList());
    }
    
    /**
     * Creates a unique key for deduplication.
     * Handles null values by converting them to empty strings.
     */
    private String createUniqueKey(String assetName, String category, String gaps) {
        String safeAssetName = Objects.toString(assetName, "");
        String safeCategory = Objects.toString(category, "");
        String safeGaps = Objects.toString(gaps, "");
        
        return safeAssetName + "|" + safeCategory + "|" + safeGaps;
    }
    
    /**
     * Resolves the actual userId and sessionId to use.
     * Gets the latest session from ProjectType table using createdDate.
     */
    private UserSessionInfo resolveUserSession(String userId, String sessionId) {
        // If both userId and sessionId are provided, use them directly
        if (isValidString(userId) && isValidString(sessionId)) {
            log.info("Using provided session for report - User: {}, Session: {}", userId, sessionId);
            return new UserSessionInfo(userId, sessionId, true);
        }
        
        // Try to get the latest session from ProjectType table using createdDate
        try {
            Optional<ProjectType> latestProject = projectTypeRepository.findLatestSession();
            
            if (latestProject.isPresent()) {
                ProjectType project = latestProject.get();
                String resolvedUserId = project.getUserID();
                String resolvedSessionId = project.getSessionID();
                
                log.info("Resolved session for report from latest project (createdDate: {}) - User: {}, Session: {}", 
                    project.getCreatedDate(), resolvedUserId, resolvedSessionId);
                
                return new UserSessionInfo(resolvedUserId, resolvedSessionId, true);
            } else {
                log.warn("No project records found to resolve session for report, will include records with null userId/sessionId");
                // Return null values to include records with null userId/sessionId
                return new UserSessionInfo(null, null, true);
            }
            
        } catch (Exception e) {
            log.error("Error resolving latest session from ProjectType table for report", e);
            // Return null values to include records with null userId/sessionId
            return new UserSessionInfo(null, null, true);
        }
    }
    
    private boolean isValidString(String str) {
        return str != null && !str.trim().isEmpty();
    }
    
    private Cell createHeaderCell(String content, PdfFont font) {
        return new Cell()
                .add(new Paragraph(content))
                .setFont(font)
                .setFontSize(12)
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setTextAlignment(TextAlignment.CENTER)
                .setPadding(5);
    }
    
    private Cell createDataCell(String content, PdfFont font) {
        return new Cell()
                .add(new Paragraph(content))
                .setFont(font)
                .setFontSize(10)
                .setPadding(5);
    }
    
    // Helper class to hold session resolution result
    private static class UserSessionInfo {
        private final String userId;
        private final String sessionId;
        private final boolean valid;
        
        public UserSessionInfo(String userId, String sessionId, boolean valid) {
            this.userId = userId;
            this.sessionId = sessionId;
            this.valid = valid;
        }
        
        public String getUserId() { return userId; }
        public String getSessionId() { return sessionId; }
        public boolean isValid() { return valid; }
    }
}