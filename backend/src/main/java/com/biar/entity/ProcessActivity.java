package com.biar.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "process_activities")
public class ProcessActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "process_id", nullable = false)
    private BusinessProcess process;

    @Column(nullable = false)
    private String name;

    @Column(name = "critical_time_period")
    private String criticalTimePeriod;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public ProcessActivity() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public BusinessProcess getProcess() { return process; }
    public void setProcess(BusinessProcess process) { this.process = process; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCriticalTimePeriod() { return criticalTimePeriod; }
    public void setCriticalTimePeriod(String criticalTimePeriod) { this.criticalTimePeriod = criticalTimePeriod; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
