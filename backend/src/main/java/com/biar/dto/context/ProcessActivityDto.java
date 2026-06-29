package com.biar.dto.context;

import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.UUID;

public class ProcessActivityDto {

    private UUID id;
    private UUID processId;
    private String name;
    private String criticalTimePeriod;
    private String notes;
    private Integer sortOrder;
    private Instant createdAt;
    private Instant updatedAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getProcessId() { return processId; }
    public void setProcessId(UUID processId) { this.processId = processId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCriticalTimePeriod() { return criticalTimePeriod; }
    public void setCriticalTimePeriod(String criticalTimePeriod) { this.criticalTimePeriod = criticalTimePeriod; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
