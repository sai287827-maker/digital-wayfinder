package com.example.DigitalWayfinder.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WebController {
    
    @RequestMapping(value = "/{path:[^\\.]*}")
    public String redirect(@PathVariable String path) {
        // Forward all non-static resource requests to index.html
        // This allows React Router to handle client-side routing
        return "forward:/";
    }
}
