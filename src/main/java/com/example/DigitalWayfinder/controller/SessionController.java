// package com.example.DigitalWayfinder.controller;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import com.example.DigitalWayfinder.dto.UserSession;

// import java.util.HashMap;
// import java.util.Map;

// @RestController
// @RequestMapping("/api/session")
// public class SessionController {
    
//     private static final Logger log = LoggerFactory.getLogger(SessionController.class);
    
//     @GetMapping("/info")
//     public ResponseEntity<Map<String, Object>> getSessionInfo(
//             @ModelAttribute("userSession") UserSession userSession) {
        
//         log.info("=== SESSION INFO API CALLED ===");
//         log.info("Session info requested: {}", userSession);
        
//         Map<String, Object> sessionInfo = new HashMap<>();
//         sessionInfo.put("userId", userSession.getUserId());
//         sessionInfo.put("sessionId", userSession.getSessionId());
//         sessionInfo.put("userType", userSession.getUserType());
//         sessionInfo.put("isAuthenticated", userSession.isAuthenticated());
//         sessionInfo.put("isAnonymous", userSession.isAnonymous());
//         sessionInfo.put("sessionCreated", userSession.getHttpSession().getCreationTime());
//         sessionInfo.put("lastAccessed", userSession.getHttpSession().getLastAccessedTime());
        
//         if (userSession.getLoginTime() != null) {
//             sessionInfo.put("loginTime", userSession.getLoginTime());
//         }
        
//         return ResponseEntity.ok(sessionInfo);
//     }
    
//     @PostMapping("/refresh")
//     public ResponseEntity<?> refreshSession(@ModelAttribute("userSession") UserSession userSession) {
        
//         log.info("=== SESSION REFRESH API CALLED ===");
//         log.info("Session refresh for: {}", userSession);
        
//         // Session is automatically refreshed by accessing it
//         // Just update last accessed time
//         userSession.getHttpSession().setMaxInactiveInterval(1800); // Reset timeout
        
//         return ResponseEntity.ok(Map.of(
//             "success", true,
//             "message", "Session refreshed successfully",
//             "sessionId", userSession.getSessionId(),
//             "userId", userSession.getUserId()
//         ));
//     }
// }
