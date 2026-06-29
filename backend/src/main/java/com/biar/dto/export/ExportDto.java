package com.biar.dto.export;

import java.time.Instant;
import java.util.UUID;

public class ExportDto {

    private UUID id;
    private UUID instanceId;
    private String type;
    private String fileName;
    private Long fileSize;
    private UUID exportedBy;
    private String exportedByName;
    private Instant createdAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getInstanceId() { return instanceId; }
    public void setInstanceId(UUID instanceId) { this.instanceId = instanceId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    public UUID getExportedBy() { return exportedBy; }
    public void setExportedBy(UUID exportedBy) { this.exportedBy = exportedBy; }
    public String getExportedByName() { return exportedByName; }
    public void setExportedByName(String exportedByName) { this.exportedByName = exportedByName; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
