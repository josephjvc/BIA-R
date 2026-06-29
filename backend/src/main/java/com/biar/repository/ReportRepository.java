package com.biar.repository;

import com.biar.entity.Report;
import com.biar.entity.ReportType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReportRepository extends JpaRepository<Report, UUID> {
    List<Report> findByInstanceIdOrderByCreatedAtDesc(UUID instanceId);
    List<Report> findByInstanceIdAndTypeOrderByCreatedAtDesc(UUID instanceId, ReportType type);
    long countByInstanceId(UUID instanceId);
}
