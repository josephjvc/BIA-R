package com.biar.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "business_processes")
public class BusinessProcess {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instance_id", nullable = false)
    private Instance instance;

    @Column(nullable = false)
    private String name;

    @Column(name = "business_unit")
    private String businessUnit;

    private String owner;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "key_objectives", columnDefinition = "TEXT")
    private String keyObjectives;

    private String country;

    private String region;

    @Column(columnDefinition = "TEXT")
    private String sites;

    @Column(name = "employees_count")
    private Integer employeesCount;

    @Column(name = "bia_periodicity")
    private String biaPeriodicity;

    @Column(name = "critical_time_period")
    private String criticalTimePeriod;

    private String criticality;

    @Column(nullable = false)
    private String status = "active";

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

    public BusinessProcess() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Instance getInstance() { return instance; }
    public void setInstance(Instance instance) { this.instance = instance; }
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
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
