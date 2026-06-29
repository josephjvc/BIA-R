package com.biar.service;

import com.biar.dto.risk.*;
import com.biar.entity.*;
import com.biar.exception.ResourceNotFoundException;
import com.biar.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RiskService {

    private final RiskRepository riskRepository;
    private final InstanceRepository instanceRepository;
    private final BusinessProcessRepository processRepository;
    private final StatusTransitionService statusTransitionService;
    private final ActivityLogService activityLogService;
    private final InstanceAuthorizationService auth;

    private static final RiskLevel[][] RISK_MATRIX = {
        { RiskLevel.VERY_LOW, RiskLevel.LOW,     RiskLevel.MEDIUM,  RiskLevel.MEDIUM,  RiskLevel.HIGH },
        { RiskLevel.VERY_LOW, RiskLevel.LOW,     RiskLevel.MEDIUM,  RiskLevel.HIGH,    RiskLevel.HIGH },
        { RiskLevel.LOW,      RiskLevel.MEDIUM,  RiskLevel.MEDIUM,  RiskLevel.HIGH,    RiskLevel.VERY_HIGH },
        { RiskLevel.LOW,      RiskLevel.MEDIUM,  RiskLevel.HIGH,    RiskLevel.HIGH,    RiskLevel.VERY_HIGH },
        { RiskLevel.MEDIUM,   RiskLevel.HIGH,    RiskLevel.HIGH,    RiskLevel.VERY_HIGH, RiskLevel.VERY_HIGH },
    };

    public RiskService(RiskRepository riskRepository,
                       InstanceRepository instanceRepository,
                       BusinessProcessRepository processRepository,
                       StatusTransitionService statusTransitionService,
                       ActivityLogService activityLogService,
                       InstanceAuthorizationService auth) {
        this.riskRepository = riskRepository;
        this.instanceRepository = instanceRepository;
        this.processRepository = processRepository;
        this.statusTransitionService = statusTransitionService;
        this.activityLogService = activityLogService;
        this.auth = auth;
    }

    @Transactional(readOnly = true)
    public List<RiskDto> getRisks(UUID instanceId) {
        return riskRepository.findByInstanceId(instanceId)
            .stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RiskDto getRisk(UUID instanceId, UUID riskId) {
        Risk risk = riskRepository.findById(riskId)
            .orElseThrow(() -> new ResourceNotFoundException("Risk not found"));
        return toDto(risk);
    }

    @Transactional
    public RiskDto createRisk(UUID instanceId, CreateRiskRequest req, User user) {
        auth.requireEdit(instanceId, user);
        Instance instance = instanceRepository.findById(instanceId)
            .orElseThrow(() -> new ResourceNotFoundException("Instance not found"));

        var risk = new Risk();
        risk.setInstance(instance);
        risk.setName(req.getName());
        risk.setDescription(req.getDescription());
        risk.setCategory(req.getCategory());
        risk.setProbability(req.getProbability());
        risk.setImpact(req.getImpact());
        risk.setRiskLevel(calculateRiskLevel(req.getProbability(), req.getImpact()));
        risk.setTreatment(req.getTreatment());
        risk.setActionPlan(req.getActionPlan());
        risk.setOwner(req.getOwner());
        risk.setNotes(req.getNotes());

        if (req.getProcessId() != null) {
            BusinessProcess process = processRepository.findById(req.getProcessId())
                .orElseThrow(() -> new ResourceNotFoundException("Process not found"));
            risk.setProcess(process);
        }

        risk = riskRepository.save(risk);

        resetStatusIfNeeded(instance, user, "risk_created");
        activityLogService.log(instanceId, user.getId(), "RISK_CREATED",
            "{\"riskId\":\"" + risk.getId() + "\"}");

        return toDto(risk);
    }

    @Transactional
    public RiskDto updateRisk(UUID instanceId, UUID riskId, UpdateRiskRequest req, User user) {
        auth.requireEdit(instanceId, user);
        Risk risk = riskRepository.findById(riskId)
            .orElseThrow(() -> new ResourceNotFoundException("Risk not found"));

        if (req.getName() != null) risk.setName(req.getName());
        if (req.getDescription() != null) risk.setDescription(req.getDescription());
        if (req.getCategory() != null) risk.setCategory(req.getCategory());
        if (req.getProbability() != null) risk.setProbability(req.getProbability());
        if (req.getImpact() != null) risk.setImpact(req.getImpact());

        boolean recalc = req.getProbability() != null || req.getImpact() != null;
        if (recalc) {
            risk.setRiskLevel(calculateRiskLevel(
                req.getProbability() != null ? req.getProbability() : risk.getProbability(),
                req.getImpact() != null ? req.getImpact() : risk.getImpact()
            ));
        }

        if (req.getTreatment() != null) risk.setTreatment(req.getTreatment());
        if (req.getActionPlan() != null) risk.setActionPlan(req.getActionPlan());
        if (req.getOwner() != null) risk.setOwner(req.getOwner());
        if (req.getStatus() != null) risk.setStatus(req.getStatus());
        if (req.getNotes() != null) risk.setNotes(req.getNotes());

        if (req.getProcessId() != null) {
            BusinessProcess process = processRepository.findById(req.getProcessId())
                .orElseThrow(() -> new ResourceNotFoundException("Process not found"));
            risk.setProcess(process);
        }

        risk = riskRepository.save(risk);

        Instance instance = risk.getInstance();
        resetStatusIfNeeded(instance, user, "risk_updated");

        return toDto(risk);
    }

    @Transactional
    public void deleteRisk(UUID instanceId, UUID riskId, User user) {
        auth.requireEdit(instanceId, user);
        Risk risk = riskRepository.findById(riskId)
            .orElseThrow(() -> new ResourceNotFoundException("Risk not found"));
        riskRepository.delete(risk);

        activityLogService.log(instanceId, user.getId(), "RISK_DELETED", null);
    }

    private void resetStatusIfNeeded(Instance instance, User user, String reason) {
        if (instance.getStatus() != InstanceStatus.IN_PROGRESS && instance.getStatus() != InstanceStatus.ARCHIVED) {
            statusTransitionService.resetToInProgress(instance, "Critical change: " + reason, user);
        }
    }

    public static RiskLevel calculateRiskLevel(Integer probability, Integer impact) {
        if (probability == null || impact == null) return null;
        int p = Math.max(1, Math.min(5, probability));
        int i = Math.max(1, Math.min(5, impact));
        return RISK_MATRIX[p - 1][i - 1];
    }

    private RiskDto toDto(Risk r) {
        var dto = new RiskDto();
        dto.setId(r.getId());
        dto.setInstanceId(r.getInstance().getId());
        if (r.getProcess() != null) {
            dto.setProcessId(r.getProcess().getId());
            dto.setProcessName(r.getProcess().getName());
        }
        dto.setName(r.getName());
        dto.setDescription(r.getDescription());
        dto.setCategory(r.getCategory());
        dto.setProbability(r.getProbability());
        dto.setImpact(r.getImpact());
        dto.setRiskLevel(r.getRiskLevel() != null ? r.getRiskLevel().getValue() : null);
        dto.setTreatment(r.getTreatment());
        dto.setActionPlan(r.getActionPlan());
        dto.setOwner(r.getOwner());
        dto.setStatus(r.getStatus());
        dto.setNotes(r.getNotes());
        dto.setCreatedAt(r.getCreatedAt());
        dto.setUpdatedAt(r.getUpdatedAt());
        return dto;
    }
}
