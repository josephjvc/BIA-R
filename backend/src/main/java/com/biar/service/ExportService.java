package com.biar.service;

import com.biar.dto.export.*;
import com.biar.entity.*;
import com.biar.exception.ResourceNotFoundException;
import com.biar.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ExportService {

    private final InstanceExportRepository exportRepository;
    private final InstanceRepository instanceRepository;

    public ExportService(InstanceExportRepository exportRepository,
                         InstanceRepository instanceRepository) {
        this.exportRepository = exportRepository;
        this.instanceRepository = instanceRepository;
    }

    @Transactional(readOnly = true)
    public List<ExportDto> getExports(UUID instanceId) {
        return exportRepository.findByInstanceIdOrderByCreatedAtDesc(instanceId)
            .stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public ExportDto createExport(UUID instanceId, CreateExportRequest req, User user) {
        Instance instance = instanceRepository.findById(instanceId)
            .orElseThrow(() -> new ResourceNotFoundException("Instance not found"));

        var export = new InstanceExport();
        export.setInstance(instance);
        export.setType(req.getType());
        export.setFileName(req.getFileName() != null ? req.getFileName() : req.getType() + "_export");
        export.setExportedBy(user);
        export = exportRepository.save(export);

        return toDto(export);
    }

    private ExportDto toDto(InstanceExport e) {
        var dto = new ExportDto();
        dto.setId(e.getId());
        dto.setInstanceId(e.getInstance().getId());
        dto.setType(e.getType());
        dto.setFileName(e.getFileName());
        dto.setFileSize(e.getFileSize());
        dto.setExportedBy(e.getExportedBy().getId());
        dto.setExportedByName(e.getExportedBy().getDisplayName());
        dto.setCreatedAt(e.getCreatedAt());
        return dto;
    }
}
