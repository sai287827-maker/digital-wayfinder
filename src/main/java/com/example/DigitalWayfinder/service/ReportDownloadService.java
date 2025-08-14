package com.example.DigitalWayfinder.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.example.DigitalWayfinder.dto.ReportDownloadDto;
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

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportDownloadService {
    
    private final ReportDownloadRepository reportDownloadRepository;
    
    public byte[] generatePdfReport(String userId, String sessionId) {
        log.info("Generating PDF report for user: {}, session: {}", userId, sessionId);
        
        try {
            // Fetch data from database using native query
            List<Object[]> rawData = reportDownloadRepository.findAllReportData();
            List<ReportDownloadDto> reportData = new ArrayList<>();
            
            // Convert raw data to DTOs
            for (Object[] row : rawData) {
                ReportDownloadDto dto = ReportDownloadDto.builder()
                        .assetName(row[1] != null ? row[1].toString() : null)  // Assert Name
                        .category(row[2] != null ? row[2].toString() : null)   // Category
                        .gaps(row[3] != null ? row[3].toString() : null)       // Gaps
                        .build();
                reportData.add(dto);
            }
            
            log.info("Fetched {} records from database", reportData.size());
            
            // Generate PDF
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
            
            // Add metadata
            Paragraph metadata = new Paragraph()
                    .add("Generated on: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                    .add("\n")
                    .add("User ID: " + userId)
                    .add("\n")
                    .add("Session ID: " + sessionId)
                    .setFont(font)
                    .setFontSize(10)
                    .setMarginBottom(20);
            document.add(metadata);
            
            // Add summary
            Paragraph summary = new Paragraph("Total Records: " + reportData.size())
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
            
            // Add data rows
            for (ReportDownloadDto dto : reportData) {
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
            
            log.info("Successfully generated PDF report with {} records", reportData.size());
            return baos.toByteArray();
            
        } catch (Exception e) {
            log.error("Error generating PDF report", e);
            throw new RuntimeException("Failed to generate PDF report: " + e.getMessage());
        }
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
}