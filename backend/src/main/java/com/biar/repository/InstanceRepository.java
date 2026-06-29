package com.biar.repository;

import com.biar.entity.Instance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface InstanceRepository extends JpaRepository<Instance, UUID> {
    List<Instance> findByOrganizationIdOrderByCreatedAtDesc(UUID organizationId);
}
