package com.biar.dto.risk;

import java.util.UUID;

public class UpdateRiskRequest {

    private String name;
    private UUID processId;
    private String description;
    private String category;
    private Integer probability;
    private Integer impact;
    private String treatment;
    private String actionPlan;
    private String owner;
    private String status;
    private String notes;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public UUID getProcessId() { return processId; }
    public void setProcessId(UUID processId) { this.processId = processId; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Integer getProbability() { return probability; }
    public void setProbability(Integer probability) { this.probability = probability; }
    public Integer getImpact() { return impact; }
    public void setImpact(Integer impact) { this.impact = impact; }
    public String getTreatment() { return treatment; }
    public void setTreatment(String treatment) { this.treatment = treatment; }
    public String getActionPlan() { return actionPlan; }
    public void setActionPlan(String actionPlan) { this.actionPlan = actionPlan; }
    public String getOwner() { return owner; }
    public void setOwner(String owner) { this.owner = owner; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
