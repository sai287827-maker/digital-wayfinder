package com.example.DigitalWayfinder.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "index.html";
    }
    @GetMapping("/hello")
    @ResponseBody
    public String hello() {
        //return "Hello, Spring Boot from VS Code!";
        return "<h1>Welcome to My Spring Boot App!</h1>";
    }


}
