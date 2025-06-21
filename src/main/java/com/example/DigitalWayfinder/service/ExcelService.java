package com.example.DigitalWayfinder.service;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;

import com.example.DigitalWayfinder.dto.AssessmentReportDTO;

@Service
public class ExcelService {
public byte[] generateAssessmentReport(List<AssessmentReportDTO> data) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Assessment Report");
        
        // Create header style
        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerFont.setFontHeightInPoints((short) 12);
        headerStyle.setFont(headerFont);
        headerStyle.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        headerStyle.setBorderTop(BorderStyle.THIN);
        headerStyle.setBorderBottom(BorderStyle.THIN);
        headerStyle.setBorderLeft(BorderStyle.THIN);
        headerStyle.setBorderRight(BorderStyle.THIN);
        headerStyle.setAlignment(HorizontalAlignment.CENTER);
        headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        
        // Create data style
        CellStyle dataStyle = workbook.createCellStyle();
        dataStyle.setBorderTop(BorderStyle.THIN);
        dataStyle.setBorderBottom(BorderStyle.THIN);
        dataStyle.setBorderLeft(BorderStyle.THIN);
        dataStyle.setBorderRight(BorderStyle.THIN);
        dataStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        dataStyle.setWrapText(true);
        
        // Create merged cell style for L1
        CellStyle mergedCellStyle = workbook.createCellStyle();
        mergedCellStyle.setBorderTop(BorderStyle.THIN);
        mergedCellStyle.setBorderBottom(BorderStyle.THIN);
        mergedCellStyle.setBorderLeft(BorderStyle.THIN);
        mergedCellStyle.setBorderRight(BorderStyle.THIN);
        mergedCellStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        mergedCellStyle.setAlignment(HorizontalAlignment.CENTER);
        mergedCellStyle.setWrapText(true);
        Font mergedFont = workbook.createFont();
        mergedFont.setBold(true);
        mergedCellStyle.setFont(mergedFont);
        
        // Create header row
        Row headerRow = sheet.createRow(0);
        String[] headers = {"L1", "L2", "Asset Type", "Asset Name", "Asset Reference"};
        
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }
        
        // Group data by L1 to identify merge ranges
        Map<String, Integer> l1Groups = new LinkedHashMap<>();
        Map<String, Integer> l1StartRows = new LinkedHashMap<>();
        
        // First pass: count occurrences and track start positions
        int currentRow = 1;
        for (AssessmentReportDTO item : data) {
            String l1Value = item.getL1() != null ? item.getL1() : "";
            if (!l1Groups.containsKey(l1Value)) {
                l1Groups.put(l1Value, 0);
                l1StartRows.put(l1Value, currentRow);
            }
            l1Groups.put(l1Value, l1Groups.get(l1Value) + 1);
            currentRow++;
        }
        
        // Create data rows
        int rowNum = 1;
        String currentL1 = null;
        int l1StartRow = -1;
        
        for (AssessmentReportDTO item : data) {
            Row row = sheet.createRow(rowNum);
            
            String l1Value = item.getL1() != null ? item.getL1() : "";
            
            // Handle L1 cell - only set value for first occurrence
            Cell cell0 = row.createCell(0);
            if (!l1Value.equals(currentL1)) {
                cell0.setCellValue(l1Value);
                currentL1 = l1Value;
                l1StartRow = rowNum;
            }
            cell0.setCellStyle(mergedCellStyle);
            
            // Other cells
            Cell cell1 = row.createCell(1);
            cell1.setCellValue(item.getL2() != null ? item.getL2() : "");
            cell1.setCellStyle(dataStyle);
            
            Cell cell2 = row.createCell(2);
            cell2.setCellValue(item.getAssetType() != null ? item.getAssetType() : "");
            cell2.setCellStyle(dataStyle);
            
            Cell cell3 = row.createCell(3);
            cell3.setCellValue(item.getAssetName() != null ? item.getAssetName() : "");
            cell3.setCellStyle(dataStyle);
            
            Cell cell4 = row.createCell(4);
            cell4.setCellValue(item.getAssetReference() != null ? item.getAssetReference() : "");
            cell4.setCellStyle(dataStyle);
            
            rowNum++;
        }
        
        // Merge L1 cells where there are multiple rows with same L1 value
        for (Map.Entry<String, Integer> entry : l1Groups.entrySet()) {
            String l1Value = entry.getKey();
            int count = entry.getValue();
            int startRow = l1StartRows.get(l1Value);
            
            if (count > 1) {
                // Merge cells from startRow to startRow + count - 1
                CellRangeAddress mergeRange = new CellRangeAddress(
                    startRow, // first row
                    startRow + count - 1, // last row
                    0, // first column (L1)
                    0  // last column (L1)
                );
                sheet.addMergedRegion(mergeRange);
                
                // Apply borders to merged region
                for (int r = startRow; r <= startRow + count - 1; r++) {
                    Row row = sheet.getRow(r);
                    if (row != null) {
                        Cell cell = row.getCell(0);
                        if (cell != null) {
                            cell.setCellStyle(mergedCellStyle);
                        }
                    }
                }
            }
        }
        
        // Set column widths
        sheet.setColumnWidth(0, 8000);  // L1 - wider for longer text
        sheet.setColumnWidth(1, 8000);  // L2 - wider for longer text  
        sheet.setColumnWidth(2, 4000);  // Asset Type
        sheet.setColumnWidth(3, 6000);  // Asset Name
        sheet.setColumnWidth(4, 12000); // Asset Reference - widest for URLs
        
        // Set row heights for better readability
        for (int i = 1; i <= rowNum; i++) {
            Row row = sheet.getRow(i);
            if (row != null) {
                row.setHeightInPoints(25);
            }
        }
        
        // Convert to byte array
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        
        return outputStream.toByteArray();
    }
}
