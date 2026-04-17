package com.example.DigitalWayfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.DigitalWayfinder.entity.UserPlatform;
import com.example.DigitalWayfinder.entity.UserPlatformId;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface UserPlatformRepository extends JpaRepository<UserPlatform, UserPlatformId> {

    List<UserPlatform> findByUserIdAndSessionId(String userId, String sessionId);

    List<UserPlatform> findByUserId(String userId);

    @Query("SELECT up FROM UserPlatform up WHERE up.userId = :userId AND up.sessionId = :sessionId AND up.functionalArea = :functionalArea")
    List<UserPlatform> findByUserSessionAndFunctionalArea(@Param("userId") String userId,
            @Param("sessionId") String sessionId,
            @Param("functionalArea") String functionalArea);

    @Modifying
    @Transactional
    @Query("DELETE FROM UserPlatform u WHERE u.userId = :userId AND u.sessionId = :sessionId")
    void deleteAllByUserIdAndSessionId(@Param("userId") String userId,
            @Param("sessionId") String sessionId);

}
