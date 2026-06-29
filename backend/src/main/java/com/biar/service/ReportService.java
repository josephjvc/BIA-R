package com.biar.service;

import com.biar.dto.report.*;
import com.biar.entity.*;
import com.biar.exception.ResourceNotFoundException;
import com.biar.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private static final Logger log = LoggerFactory.getLogger(ReportService.class);

    private final ReportRepository reportRepository;
    private final InstanceRepository instanceRepository;
    private final PdfGenerationService pdfGenerationService;
    private final ActivityLogService activityLogService;
    private final InstanceAuthorizationService auth;

    @Value("${app.exports.dir:./exports}")
    private String exportsDir;

    public ReportService(ReportRepository reportRepository,
                         InstanceRepository instanceRepository,
                         PdfGenerationService pdfGenerationService,
                         ActivityLogService activityLogService,
                         InstanceAuthorizationService auth) {
        this.reportRepository = reportRepository;
        this.instanceRepository = instanceRepository;
        this.pdfGenerationService = pdfGenerationService;
        this.activityLogService = activityLogService;
        this.auth = auth;
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
        auth.requireRead(instanceId, user);
        Instance instance = instanceRepository.findById(instanceId)
            .orElseThrow(() -> new ResourceNotFoundException("Instance not found"));

        ReportType type;
        try {
            type = ReportType.valueOf(req.getType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid report type: " + req.getType());
        }

        byte[] pdfBytes = pdfGenerationService.generate(instanceId, type, user);
        String fileName = type.getValue() + "_" + UUID.randomUUID() + ".pdf";
        String filePath = saveFile(instanceId, fileName, pdfBytes);

        var report = new Report();
        report.setInstance(instance);
        report.setType(type);
        report.setTitle(req.getTitle() != null ? req.getTitle() : type.getValue() + " report");
        report.setSnapshot("{\"filePath\":\"" + filePath.replace("\\", "\\\\") + "\"}");
        report.setGeneratedBy(user);
        report = reportRepository.save(report);

        activityLogService.log(instanceId, user.getId(), "REPORT_GENERATED",
            "{\"type\":\"" + type.getValue() + "\",\"fileName\":\"" + fileName + "\"}");

        log.info("Report generated: instance={}, type={}, file={}", instanceId, type.getValue(), filePath);
        return toDto(report);
    }

    @Transactional(readOnly = true)
    public ReportDto getReport(UUID instanceId, UUID reportId) {
        Report report = reportRepository.findById(reportId)
            .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        return toDto(report);
    }

    public Path getReportFilePath(UUID reportId) {
        Report report = reportRepository.findById(reportId)
            .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        try {
            var json = new com.fasterxml.jackson.databind.ObjectMapper().readTree(report.getSnapshot());
            return Paths.get(json.get("filePath").asText());
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse report file path", e);
        }
    }

    private String saveFile(UUID instanceId, String fileName, byte[] content) {
        try {
            Path dir = Paths.get(exportsDir, instanceId.toString());
            Files.createDirectories(dir);
            Path file = dir.resolve(fileName);
            Files.write(file, content);
            return file.toAbsolutePath().toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to save report file", e);
        }
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
