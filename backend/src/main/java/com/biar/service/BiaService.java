package com.biar.service;

import com.biar.dto.bia.*;
import com.biar.entity.*;
import com.biar.exception.ResourceNotFoundException;
import com.biar.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BiaService {

    private final BiaAssessmentRepository biaRepository;
    private final InstanceRepository instanceRepository;
    private final BusinessProcessRepository processRepository;
    private final StatusTransitionService statusTransitionService;
    private final ActivityLogService activityLogService;
    private final InstanceAuthorizationService auth;

    public BiaService(BiaAssessmentRepository biaRepository,
                      InstanceRepository instanceRepository,
                      BusinessProcessRepository processRepository,
                      StatusTransitionService statusTransitionService,
                      ActivityLogService activityLogService,
                      InstanceAuthorizationService auth) {
        this.biaRepository = biaRepository;
        this.instanceRepository = instanceRepository;
        this.processRepository = processRepository;
        this.statusTransitionService = statusTransitionService;
        this.activityLogService = activityLogService;
        this.auth = auth;
    }

    @Transactional(readOnly = true)
    public List<BiaAssessmentDto> getAssessments(UUID instanceId) {
        return biaRepository.findByInstanceId(instanceId)
            .stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BiaAssessmentDto getAssessment(UUID instanceId, UUID processId) {
        BiaAssessment assessment = biaRepository.findByInstanceIdAndProcessId(instanceId, processId)
            .orElseThrow(() -> new ResourceNotFoundException("BIA assessment not found for this process"));
        return toDto(assessment);
    }

    @Transactional
    public BiaAssessmentDto upsertAssessment(UUID instanceId, UUID processId, UpsertBiaRequest req, User user) {
        auth.requireEdit(instanceId, user);
        Instance instance = instanceRepository.findById(instanceId)
            .orElseThrow(() -> new ResourceNotFoundException("Instance not found"));
        BusinessProcess process = processRepository.findById(processId)
            .orElseThrow(() -> new ResourceNotFoundException("Process not found"));

        BiaAssessment assessment = biaRepository
            .findByInstanceIdAndProcessId(instanceId, processId)
            .orElseGet(BiaAssessment::new);

        boolean isNew = assessment.getId() == null;

        if (isNew) {
            assessment.setInstance(instance);
            assessment.setProcess(process);
        }

        assessment.setMtpd(req.getMtpd());
        assessment.setRto(req.getRto());
        assessment.setRpo(req.getRpo());
        assessment.setImpactScore(req.getImpactScore());
        assessment.setCriticality(req.getCriticality());
        assessment.setImpactCategories(req.getImpactCategories());
        assessment.setNotes(req.getNotes());
        assessment.setAssessedBy(user);
        assessment.setAssessedAt(Instant.now());
        assessment = biaRepository.save(assessment);

        resetStatusIfNeeded(instance, user, "bia_assessment_updated");

        String details = String.format(
            "{\"processId\":\"%s\",\"isNew\":%b}", processId, isNew);
        activityLogService.log(instanceId, user.getId(), "BIA_UPSERTED", details);

        return toDto(assessment);
    }

    private void resetStatusIfNeeded(Instance instance, User user, String reason) {
        if (instance.getStatus() != InstanceStatus.IN_PROGRESS && instance.getStatus() != InstanceStatus.ARCHIVED) {
            statusTransitionService.resetToInProgress(instance, "Critical change: " + reason, user);
        }
    }

    private BiaAssessmentDto toDto(BiaAssessment a) {
        var dto = new BiaAssessmentDto();
        dto.setId(a.getId());
        dto.setInstanceId(a.getInstance().getId());
        dto.setProcessId(a.getProcess().getId());
        dto.setProcessName(a.getProcess().getName());
        dto.setMtpd(a.getMtpd());
        dto.setRto(a.getRto());
        dto.setRpo(a.getRpo());
        dto.setImpactScore(a.getImpactScore());
        dto.setCriticality(a.getCriticality());
        dto.setImpactCategories(a.getImpactCategories());
        dto.setNotes(a.getNotes());
        if (a.getAssessedBy() != null) {
            dto.setAssessedBy(a.getAssessedBy().getId());
            dto.setAssessedByName(a.getAssessedBy().getDisplayName());
        }
        dto.setAssessedAt(a.getAssessedAt());
        dto.setCreatedAt(a.getCreatedAt());
        dto.setUpdatedAt(a.getUpdatedAt());
        return dto;
    }
}
