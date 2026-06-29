package com.biar.service;

import com.biar.dto.export.*;
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
public class ExportService {

    private static final Logger log = LoggerFactory.getLogger(ExportService.class);

    private final InstanceExportRepository exportRepository;
    private final InstanceRepository instanceRepository;
    private final RiskService riskService;
    private final BiaService biaService;

    @Value("${app.exports.dir:./exports}")
    private String exportsDir;

    public ExportService(InstanceExportRepository exportRepository,
                         InstanceRepository instanceRepository,
                         RiskService riskService,
                         BiaService biaService) {
        this.exportRepository = exportRepository;
        this.instanceRepository = instanceRepository;
        this.riskService = riskService;
        this.biaService = biaService;
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

        String csv = generateCsv(instanceId, req.getType());
        String fileName = req.getType() + "_" + UUID.randomUUID() + ".csv";
        String filePath = saveFile(instanceId, fileName, csv.getBytes());

        var export = new InstanceExport();
        export.setInstance(instance);
        export.setType(req.getType());
        export.setFileName(fileName);
        export.setFileSize((long) csv.getBytes().length);
        export.setFilePath(filePath);
        export.setExportedBy(user);
        export = exportRepository.save(export);

        log.info("Export created: instance={}, type={}, file={}", instanceId, req.getType(), filePath);
        return toDto(export);
    }

    public Path getExportFilePath(UUID exportId) {
        InstanceExport export = exportRepository.findById(exportId)
            .orElseThrow(() -> new ResourceNotFoundException("Export not found"));
        return Paths.get(export.getFilePath());
    }

    private String generateCsv(UUID instanceId, String type) {
        StringBuilder csv = new StringBuilder();
        switch (type.toLowerCase()) {
            case "risks" -> {
                csv.append("Risk,Category,Probability,Impact,Level,Treatment,Action Plan,Owner\n");
                var risks = riskService.getRisks(instanceId);
                for (var r : risks) {
                    csv.append(escapeCsv(r.getName())).append(",")
                        .append(escapeCsv(r.getCategory())).append(",")
                        .append(r.getProbability()).append(",")
                        .append(r.getImpact()).append(",")
                        .append(r.getRiskLevel() != null ? r.getRiskLevel() : "").append(",")
                        .append(escapeCsv(r.getTreatment())).append(",")
                        .append(escapeCsv(r.getActionPlan())).append(",")
                        .append(escapeCsv(r.getOwner())).append("\n");
                }
            }
            case "bia" -> {
                csv.append("Process,MTPD,RTO,RPO,Score,Criticality\n");
                var assessments = biaService.getAssessments(instanceId);
                for (var a : assessments) {
                    csv.append(escapeCsv(a.getProcessName())).append(",")
                        .append(a.getMtpd() != null ? a.getMtpd() : "").append(",")
                        .append(a.getRto() != null ? a.getRto() : "").append(",")
                        .append(a.getRpo() != null ? a.getRpo() : "").append(",")
                        .append(a.getImpactScore() != null ? a.getImpactScore() : "").append(",")
                        .append(escapeCsv(a.getCriticality())).append("\n");
                }
            }
            default -> csv.append("Unsupported export type: ").append(type).append("\n");
        }
        return csv.toString();
    }

    private String escapeCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }

    private String saveFile(UUID instanceId, String fileName, byte[] content) {
        try {
            Path dir = Paths.get(exportsDir, instanceId.toString());
            Files.createDirectories(dir);
            Path file = dir.resolve(fileName);
            Files.write(file, content);
            return file.toAbsolutePath().toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to save export file", e);
        }
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
