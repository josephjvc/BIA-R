package com.biar.entity;

public enum InstanceStatus {
    IN_PROGRESS("in_progress"),
    COMPLETED("completed"),
    REVIEWED("reviewed"),
    APPROVED("approved"),
    DISAPPROVED("disapproved"),
    FINISHED("finished"),
    ARCHIVED("archived");

    private final String value;

    InstanceStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
