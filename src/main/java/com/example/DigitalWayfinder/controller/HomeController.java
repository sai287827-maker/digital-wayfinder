package com.example.DigitalWayfinder.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class HomeController {

    @GetMapping("/home")
    public String home() {
        return "index.html";
    }

//     @PostMapping("/login")
//     public ResponseEntity<?> login(@RequestBody LoginRequest request, 
//                               HttpServletRequest httpRequest) {
//     // Validate credentials
//     if (isValidUser(request.getUsername(), request.getPassword())) {
        
//         // Get or create session
//         HttpSession session = httpRequest.getSession(true);
        
//         // Set authenticated user in session
//         session.setAttribute("userId", request.getUsername());
//         session.setAttribute("userType", "AUTHENTICATED");
//         session.setMaxInactiveInterval(1800); // 30 minutes
        
//         // Generate JWT token
//         String token = jwtUtil.generateToken(request.getUsername());
        
//         return ResponseEntity.ok(new LoginResponse(token, request.getUsername()));
//     }
    
//     return ResponseEntity.status(401).body("Invalid credentials");
// }
    
    @GetMapping("/hello")
    @ResponseBody
    public String hello() {
        //return "Hello, Spring Boot from VS Code!";
        return "<h1>Welcome to My Spring Boot App!</h1>";
    }


}
