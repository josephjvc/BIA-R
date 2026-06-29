package com.biar.dto.bia;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class BiaAssessmentDto {

    private UUID id;
    private UUID instanceId;
    private UUID processId;
    private String processName;
    private Integer mtpd;
    private Integer rto;
    private Integer rpo;
    private BigDecimal impactScore;
    private String criticality;
    private String impactCategories;
    private String notes;
    private UUID assessedBy;
    private String assessedByName;
    private Instant assessedAt;
    private Instant createdAt;
    private Instant updatedAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getInstanceId() { return instanceId; }
    public void setInstanceId(UUID instanceId) { this.instanceId = instanceId; }
    public UUID getProcessId() { return processId; }
    public void setProcessId(UUID processId) { this.processId = processId; }
    public String getProcessName() { return processName; }
    public void setProcessName(String processName) { this.processName = processName; }
    public Integer getMtpd() { return mtpd; }
    public void setMtpd(Integer mtpd) { this.mtpd = mtpd; }
    public Integer getRto() { return rto; }
    public void setRto(Integer rto) { this.rto = rto; }
    public Integer getRpo() { return rpo; }
    public void setRpo(Integer rpo) { this.rpo = rpo; }
    public BigDecimal getImpactScore() { return impactScore; }
    public void setImpactScore(BigDecimal impactScore) { this.impactScore = impactScore; }
    public String getCriticality() { return criticality; }
    public void setCriticality(String criticality) { this.criticality = criticality; }
    public String getImpactCategories() { return impactCategories; }
    public void setImpactCategories(String impactCategories) { this.impactCategories = impactCategories; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public UUID getAssessedBy() { return assessedBy; }
    public void setAssessedBy(UUID assessedBy) { this.assessedBy = assessedBy; }
    public String getAssessedByName() { return assessedByName; }
    public void setAssessedByName(String assessedByName) { this.assessedByName = assessedByName; }
    public Instant getAssessedAt() { return assessedAt; }
    public void setAssessedAt(Instant assessedAt) { this.assessedAt = assessedAt; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
