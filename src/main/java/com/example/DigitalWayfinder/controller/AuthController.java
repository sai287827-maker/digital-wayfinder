package com.example.DigitalWayfinder.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.DigitalWayfinder.dto.UserSession;
import com.example.DigitalWayfinder.dto.LoginRequest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest loginRequest,
            @ModelAttribute("userSession") UserSession userSession,
            HttpServletRequest request) {
        
        log.info("=== LOGIN API CALLED ===");
        log.info("Login attempt for username: {}", loginRequest.getUsername());
        log.info("Current session before login: {}", userSession);
        
        try {
            // Validate credentials
            if (authService.validateCredentials(loginRequest.getUsername(), loginRequest.getPassword())) {
                
                // Generate JWT token
                String token = jwtUtil.generateToken(loginRequest.getUsername());
                
                // Update session with authenticated user info
                HttpSession session = userSession.getHttpSession();
                session.setAttribute("userId", loginRequest.getUsername());
                session.setAttribute("userType", "AUTHENTICATED");
                session.setAttribute("loginTime", System.currentTimeMillis());
                session.setMaxInactiveInterval(1800); // 30 minutes
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Login successful");
                response.put("token", token);
                response.put("userId", loginRequest.getUsername());
                response.put("sessionId", userSession.getSessionId());
                
                log.info("✓ Login successful for user: {}, session: {}", 
                        loginRequest.getUsername(), userSession.getSessionId());
                
                return ResponseEntity.ok(response);
                
            } else {
                log.warn("❌ Invalid credentials for username: {}", loginRequest.getUsername());
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "Invalid username or password"
                ));
            }
            
        } catch (Exception e) {
            log.error("❌ Login error for username: {}", loginRequest.getUsername(), e);
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Login failed due to server error"
            ));
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@ModelAttribute("userSession") UserSession userSession) {
        
        log.info("=== LOGOUT API CALLED ===");
        log.info("Logout for user: {}, session: {}", userSession.getUserId(), userSession.getSessionId());
        
        try {
            // Invalidate session
            userSession.getHttpSession().invalidate();
            
            log.info("✓ Session invalidated for user: {}", userSession.getUserId());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Logout successful"
            ));
            
        } catch (Exception e) {
            log.error("❌ Logout error for user: {}", userSession.getUserId(), e);
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Logout failed"
            ));
        }
    }
}
