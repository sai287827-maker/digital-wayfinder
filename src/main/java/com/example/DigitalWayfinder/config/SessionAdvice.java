package com.example.DigitalWayfinder.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

import com.example.DigitalWayfinder.dto.UserSession;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import java.util.UUID;

@ControllerAdvice
public class SessionAdvice {
    
    private static final Logger log = LoggerFactory.getLogger(SessionAdvice.class);
    
    /**
     * This method will be automatically called for EVERY controller method
     * and will make UserSession available as a method parameter
     */
    @ModelAttribute("userSession")
    public UserSession getUserSession(HttpServletRequest request) {
        // Get or create session
        HttpSession session = request.getSession(true);
        String sessionId = session.getId();
        
        // Extract user ID using your existing logic
        String userId = getUserId(request, session);
        
        // Log for debugging
        log.debug("Session advice executed - User: {}, Session: {}", userId, sessionId);
        
        // Return UserSession object that will be available in all controllers
        return new UserSession(userId, sessionId, session);
    }
    
    /**
     * Your existing getUserId method - moved here to centralize session logic
     */
    private String getUserId(HttpServletRequest request, HttpSession session) {
        // Option 1: From JWT token (if implemented)
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // Extract user ID from JWT token
            // String userID = jwtUtil.extractUserId(authHeader.substring(7));
            // if (userID != null) return userID;
        }
        
        // Option 2: From custom header
        String userIdFromHeader = request.getHeader("X-User-ID");
        if (userIdFromHeader != null && !userIdFromHeader.trim().isEmpty()) {
            return userIdFromHeader;
        }
        
        // Option 3: From session attribute
        String userIdFromSession = (String) session.getAttribute("userId");
        if (userIdFromSession != null) {
            return userIdFromSession;
        }
        
        // Option 4: Generate anonymous user ID and store in session
        String anonymousUserId = "USER-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        session.setAttribute("userId", anonymousUserId);
        log.info("Generated anonymous user ID: {} for session: {}", anonymousUserId, session.getId());
        
        return anonymousUserId;
    }
}
