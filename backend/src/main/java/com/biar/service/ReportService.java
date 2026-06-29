package com.biar.service;

import com.biar.dto.report.*;
import com.biar.entity.*;
import com.biar.exception.ResourceNotFoundException;
import com.biar.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final InstanceRepository instanceRepository;

    public ReportService(ReportRepository reportRepository,
                         InstanceRepository instanceRepository) {
        this.reportRepository = reportRepository;
        this.instanceRepository = instanceRepository;
    }

    @Transactional(readOnly = true)
    public List<ReportDto> getReports(UUID instanceId) {
        return reportRepository.findByInstanceIdOrderByCreatedAtDesc(instanceId)
            .stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public ReportDto generateReport(UUID instanceId, GenerateReportRequest req, User user) {
        Instance instance = instanceRepository.findById(instanceId)
            .orElseThrow(() -> new ResourceNotFoundException("Instance not found"));

        ReportType type;
        try {
            type = ReportType.valueOf(req.getType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid report type: " + req.getType());
        }

        var report = new Report();
        report.setInstance(instance);
        report.setType(type);
        report.setTitle(req.getTitle() != null ? req.getTitle() : type.getValue() + " report");
        report.setSnapshot("{}");
        report.setGeneratedBy(user);
        report = reportRepository.save(report);

        return toDto(report);
    }

    @Transactional(readOnly = true)
    public ReportDto getReport(UUID instanceId, UUID reportId) {
        Report report = reportRepository.findById(reportId)
            .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        return toDto(report);
    }

    private ReportDto toDto(Report r) {
        var dto = new ReportDto();
        dto.setId(r.getId());
        dto.setInstanceId(r.getInstance().getId());
        dto.setType(r.getType().getValue());
        dto.setTitle(r.getTitle());
        dto.setSnapshot(r.getSnapshot());
        dto.setGeneratedBy(r.getGeneratedBy().getId());
        dto.setGeneratedByName(r.getGeneratedBy().getDisplayName());
        dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }
}
