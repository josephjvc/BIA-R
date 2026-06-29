package com.biar.dto.risk;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.UUID;

public class CreateRiskRequest {

    @NotBlank(message = "Risk name is required")
    private String name;

    private UUID processId;
    private String description;
    private String category;

    @Min(value = 1, message = "Probability must be between 1 and 5")
    @Max(value = 5, message = "Probability must be between 1 and 5")
    private Integer probability;

    @Min(value = 1, message = "Impact must be between 1 and 5")
    @Max(value = 5, message = "Impact must be between 1 and 5")
    private Integer impact;

    private String treatment;
    private String actionPlan;
    private String owner;
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
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
