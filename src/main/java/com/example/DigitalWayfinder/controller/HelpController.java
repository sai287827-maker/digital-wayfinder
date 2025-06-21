package com.example.DigitalWayfinder.controller;

import java.io.File;
import java.io.FileInputStream;
import org.springframework.http.HttpHeaders;
import java.io.IOException;

import org.springframework.http.MediaType;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.core.io.Resource;


@RestController
@RequestMapping("/api/homepage/help")
public class HelpController {

    @GetMapping("/download")
    public ResponseEntity<Resource> downloadHelp() throws IOException {
        File file = new File("src\\main\\resources\\static\\help.pdf");
        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=help.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(file.length())
                .body(resource);
    }
}