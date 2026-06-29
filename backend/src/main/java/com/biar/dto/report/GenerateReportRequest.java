package com.biar.dto.report;

import jakarta.validation.constraints.NotBlank;

public class GenerateReportRequest {

    @NotBlank(message = "Report type is required")
    private String type;

    private String title;

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
}
