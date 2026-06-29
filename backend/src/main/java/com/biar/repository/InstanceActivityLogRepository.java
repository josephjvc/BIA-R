package com.biar.repository;

import com.biar.entity.InstanceActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface InstanceActivityLogRepository extends JpaRepository<InstanceActivityLog, UUID> {
    List<InstanceActivityLog> findByInstanceIdOrderByCreatedAtDesc(UUID instanceId);
}
