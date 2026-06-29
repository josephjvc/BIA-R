package com.biar.entity;

public enum RiskLevel {
    VERY_LOW("very_low"),
    LOW("low"),
    MEDIUM("medium"),
    HIGH("high"),
    VERY_HIGH("very_high");

    private final String value;

    RiskLevel(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
