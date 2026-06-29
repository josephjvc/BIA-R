package com.biar.entity;

public enum ReportType {
    INSTANCE_SUMMARY("instance_summary"),
    INSTANCE_HISTORY("instance_history"),
    BIA("bia"),
    RISK("risk"),
    EXECUTIVE_RESILIENCE("executive_resilience");

    private final String value;

    ReportType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
