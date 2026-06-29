package com.biar.repository;

import com.biar.entity.InstanceParticipant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InstanceParticipantRepository extends JpaRepository<InstanceParticipant, UUID> {
    List<InstanceParticipant> findByInstanceId(UUID instanceId);
    Optional<InstanceParticipant> findByInstanceIdAndUserId(UUID instanceId, UUID userId);
    boolean existsByInstanceIdAndUserId(UUID instanceId, UUID userId);
}
