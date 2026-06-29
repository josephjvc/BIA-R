package com.biar.repository;

import com.biar.entity.InstanceStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface InstanceStatusHistoryRepository extends JpaRepository<InstanceStatusHistory, UUID> {
    List<InstanceStatusHistory> findByInstanceIdOrderByCreatedAtDesc(UUID instanceId);
}
