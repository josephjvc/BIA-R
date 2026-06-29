package com.biar.dto.context;

import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class BusinessProcessDto {

    private UUID id;
    private UUID instanceId;
    private String name;
    private String businessUnit;
    private String owner;
    private String description;
    private String keyObjectives;
    private String country;
    private String region;
    private String sites;
    private Integer employeesCount;
    private String biaPeriodicity;
    private String criticalTimePeriod;
    private String criticality;
    private String status;
    private String notes;
    private Integer sortOrder;
    private List<ProcessActivityDto> activities = new ArrayList<>();
    private Instant createdAt;
    private Instant updatedAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getInstanceId() { return instanceId; }
    public void setInstanceId(UUID instanceId) { this.instanceId = instanceId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getBusinessUnit() { return businessUnit; }
    public void setBusinessUnit(String businessUnit) { this.businessUnit = businessUnit; }
    public String getOwner() { return owner; }
    public void setOwner(String owner) { this.owner = owner; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getKeyObjectives() { return keyObjectives; }
    public void setKeyObjectives(String keyObjectives) { this.keyObjectives = keyObjectives; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    public String getSites() { return sites; }
    public void setSites(String sites) { this.sites = sites; }
    public Integer getEmployeesCount() { return employeesCount; }
    public void setEmployeesCount(Integer employeesCount) { this.employeesCount = employeesCount; }
    public String getBiaPeriodicity() { return biaPeriodicity; }
    public void setBiaPeriodicity(String biaPeriodicity) { this.biaPeriodicity = biaPeriodicity; }
    public String getCriticalTimePeriod() { return criticalTimePeriod; }
    public void setCriticalTimePeriod(String criticalTimePeriod) { this.criticalTimePeriod = criticalTimePeriod; }
    public String getCriticality() { return criticality; }
    public void setCriticality(String criticality) { this.criticality = criticality; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
    public List<ProcessActivityDto> getActivities() { return activities; }
    public void setActivities(List<ProcessActivityDto> activities) { this.activities = activities; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
