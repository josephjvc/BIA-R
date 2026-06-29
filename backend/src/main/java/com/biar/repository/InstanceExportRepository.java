package com.biar.repository;

import com.biar.entity.InstanceExport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface InstanceExportRepository extends JpaRepository<InstanceExport, UUID> {
    List<InstanceExport> findByInstanceIdOrderByCreatedAtDesc(UUID instanceId);
}
