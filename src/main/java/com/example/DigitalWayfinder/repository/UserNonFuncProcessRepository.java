package com.example.DigitalWayfinder.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.DigitalWayfinder.entity.UserNonFuncProcess;

@Repository
public interface UserNonFuncProcessRepository extends JpaRepository<UserNonFuncProcess, Long> {
    
    List<UserNonFuncProcess> findByUserIdAndSessionId(String userId, String sessionId);
    
    @Query("SELECT unfp FROM UserNonFuncProcess unfp WHERE unfp.userId = :userId AND unfp.sessionId = :sessionId")
    Optional<UserNonFuncProcess> findByUserIdAndSessionIdWithQuery(@Param("userId") String userId, @Param("sessionId") String sessionId);
    
    boolean existsByUserIdAndSessionId(String userId, String sessionId);
    
    void deleteByUserIdAndSessionId(String userId, String sessionId);
}
