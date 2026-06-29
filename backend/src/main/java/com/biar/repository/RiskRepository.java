package com.biar.repository;

import com.biar.entity.Risk;
import com.biar.entity.RiskLevel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RiskRepository extends JpaRepository<Risk, UUID> {
    List<Risk> findByInstanceId(UUID instanceId);
    List<Risk> findByInstanceIdAndRiskLevel(UUID instanceId, RiskLevel riskLevel);
    List<Risk> findByInstanceIdAndProcessId(UUID instanceId, UUID processId);
}
