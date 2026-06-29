package com.biar.repository;

import com.biar.entity.BusinessProcess;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BusinessProcessRepository extends JpaRepository<BusinessProcess, UUID> {
    List<BusinessProcess> findByInstanceIdOrderBySortOrder(UUID instanceId);
}
