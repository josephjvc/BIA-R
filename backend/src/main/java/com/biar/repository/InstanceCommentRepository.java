package com.biar.repository;

import com.biar.entity.InstanceComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface InstanceCommentRepository extends JpaRepository<InstanceComment, UUID> {
    List<InstanceComment> findByInstanceIdOrderByCreatedAtDesc(UUID instanceId);
}
