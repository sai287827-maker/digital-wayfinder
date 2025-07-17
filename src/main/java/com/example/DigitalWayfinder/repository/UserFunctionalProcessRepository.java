package com.example.DigitalWayfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.DigitalWayfinder.entity.UserFunctionalProcess;

import java.util.Optional;

@Repository
public interface UserFunctionalProcessRepository extends JpaRepository<UserFunctionalProcess, Long> {
    
    Optional<UserFunctionalProcess> findByUserIdAndSessionId(String userId, String sessionId);
    
    @Query("SELECT ufp FROM UserFunctionalProcess ufp WHERE ufp.userId = :userId AND ufp.sessionId = :sessionId")
    Optional<UserFunctionalProcess> findByUserIdAndSessionIdWithQuery(@Param("userId") String userId, @Param("sessionId") String sessionId);
    
    boolean existsByUserIdAndSessionId(String userId, String sessionId);
    
    void deleteByUserIdAndSessionId(String userId, String sessionId);
}
