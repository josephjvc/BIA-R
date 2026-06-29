package com.biar.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "instance_status_history")
public class InstanceStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instance_id", nullable = false)
    private Instance instance;

    @Enumerated(EnumType.STRING)
    @Column(name = "from_status")
    private InstanceStatus fromStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "to_status", nullable = false)
    private InstanceStatus toStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "changed_by", nullable = false)
    private User changedBy;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
    }

    public InstanceStatusHistory() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Instance getInstance() { return instance; }
    public void setInstance(Instance instance) { this.instance = instance; }
    public InstanceStatus getFromStatus() { return fromStatus; }
    public void setFromStatus(InstanceStatus fromStatus) { this.fromStatus = fromStatus; }
    public InstanceStatus getToStatus() { return toStatus; }
    public void setToStatus(InstanceStatus toStatus) { this.toStatus = toStatus; }
    public User getChangedBy() { return changedBy; }
    public void setChangedBy(User changedBy) { this.changedBy = changedBy; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public Instant getCreatedAt() { return createdAt; }
}
