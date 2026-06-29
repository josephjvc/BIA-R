package com.biar.repository;

import com.biar.entity.Instance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface InstanceRepository extends JpaRepository<Instance, UUID> {
    List<Instance> findByOrganizationIdOrderByCreatedAtDesc(UUID organizationId);

    @Query("""
        SELECT DISTINCT i FROM Instance i
        LEFT JOIN InstanceParticipant p ON p.instance = i
        WHERE i.createdBy.id = :userId OR p.user.id = :userId
        ORDER BY i.createdAt DESC
    """)
    List<Instance> findInstancesByUser(@Param("userId") UUID userId);
}
