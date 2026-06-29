package com.biar.dto.context;

import jakarta.validation.constraints.NotBlank;

public class CreateActivityRequest {

    @NotBlank(message = "Activity name is required")
    private String name;

    private String criticalTimePeriod;
    private String notes;
    private Integer sortOrder;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCriticalTimePeriod() { return criticalTimePeriod; }
    public void setCriticalTimePeriod(String criticalTimePeriod) { this.criticalTimePeriod = criticalTimePeriod; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
}
