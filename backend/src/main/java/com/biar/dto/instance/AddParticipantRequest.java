package com.biar.dto.instance;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class AddParticipantRequest {

    @NotNull(message = "User ID is required")
    private UUID userId;

    @NotBlank(message = "Role is required")
    private String role;

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
