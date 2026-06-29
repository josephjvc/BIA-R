package com.biar.dto.instance;

import jakarta.validation.constraints.NotBlank;

public class InstanceStatusRequest {

    @NotBlank(message = "Action is required")
    private String action;

    private String reason;

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
