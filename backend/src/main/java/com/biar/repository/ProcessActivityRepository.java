package com.biar.repository;

import com.biar.entity.ProcessActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ProcessActivityRepository extends JpaRepository<ProcessActivity, UUID> {
    List<ProcessActivity> findByProcessIdOrderBySortOrder(UUID processId);

    @Query("SELECT COUNT(pa) FROM ProcessActivity pa WHERE pa.process.instance.id = :instanceId")
    long countByInstanceId(@Param("instanceId") UUID instanceId);
}
