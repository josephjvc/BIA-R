package com.biar.dto.instance;

import java.time.Instant;
import java.util.UUID;

public class InstanceSummaryDto {

    private UUID id;
    private String name;
    private String version;
    private String status;
    private String createdByName;
    private int processCount;
    private int riskCount;
    private int activityCount;
    private int biaAssessmentCount;
    private int reportCount;
    private String org;
    private Instant createdAt;
    private Instant updatedAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCreatedByName() { return createdByName; }
    public void setCreatedByName(String createdByName) { this.createdByName = createdByName; }
    public int getProcessCount() { return processCount; }
    public void setProcessCount(int processCount) { this.processCount = processCount; }
    public int getRiskCount() { return riskCount; }
    public void setRiskCount(int riskCount) { this.riskCount = riskCount; }
    public int getActivityCount() { return activityCount; }
    public void setActivityCount(int activityCount) { this.activityCount = activityCount; }
    public int getBiaAssessmentCount() { return biaAssessmentCount; }
    public void setBiaAssessmentCount(int biaAssessmentCount) { this.biaAssessmentCount = biaAssessmentCount; }
    public int getReportCount() { return reportCount; }
    public void setReportCount(int reportCount) { this.reportCount = reportCount; }
    public String getOrg() { return org; }
    public void setOrg(String org) { this.org = org; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
