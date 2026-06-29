package com.biar.repository;

import com.biar.entity.BiaAssessment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BiaAssessmentRepository extends JpaRepository<BiaAssessment, UUID> {
    List<BiaAssessment> findByInstanceId(UUID instanceId);
    Optional<BiaAssessment> findByInstanceIdAndProcessId(UUID instanceId, UUID processId);
    long countByInstanceId(UUID instanceId);
}
