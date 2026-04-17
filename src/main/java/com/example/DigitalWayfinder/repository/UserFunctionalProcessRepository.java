package com.example.DigitalWayfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.DigitalWayfinder.entity.UserFunctionalProcess;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserFunctionalProcessRepository extends JpaRepository<UserFunctionalProcess, Long> {

    List<UserFunctionalProcess> findByUserIdAndSessionId(String userId, String sessionId);

    @Query("SELECT ufp FROM UserFunctionalProcess ufp WHERE ufp.userId = :userId AND ufp.sessionId = :sessionId")
    Optional<UserFunctionalProcess> findByUserIdAndSessionIdWithQuery(@Param("userId") String userId,
            @Param("sessionId") String sessionId);

    List<UserFunctionalProcess> findAllByUserIdAndSessionId(String userId, String sessionId);

    boolean existsByUserIdAndSessionId(String userId, String sessionId);

    @Modifying
    @Transactional
    @Query("DELETE FROM UserFunctionalProcess u WHERE u.userId = :userId AND u.sessionId = :sessionId")
    void deleteAllByUserIdAndSessionId(@Param("userId") String userId,
            @Param("sessionId") String sessionId);
}
