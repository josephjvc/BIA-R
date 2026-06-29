package com.biar.service;

import com.biar.dto.instance.*;
import com.biar.entity.*;
import com.biar.exception.ResourceNotFoundException;
import com.biar.mapper.InstanceMapper;
import com.biar.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class InstanceService {

    private final InstanceRepository instanceRepository;
    private final InstanceParticipantRepository participantRepository;
    private final BusinessProcessRepository processRepository;
    private final RiskRepository riskRepository;
    private final ProcessActivityRepository processActivityRepository;
    private final BiaAssessmentRepository biaAssessmentRepository;
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final InstanceMapper instanceMapper;
    private final StatusTransitionService statusTransitionService;
    private final ActivityLogService activityLogService;
    private final InstanceAuthorizationService auth;

    public InstanceService(InstanceRepository instanceRepository,
                           InstanceParticipantRepository participantRepository,
                           BusinessProcessRepository processRepository,
                           RiskRepository riskRepository,
                           ProcessActivityRepository processActivityRepository,
                           BiaAssessmentRepository biaAssessmentRepository,
                           ReportRepository reportRepository,
                           UserRepository userRepository,
                           OrganizationRepository organizationRepository,
                           InstanceMapper instanceMapper,
                           StatusTransitionService statusTransitionService,
                           ActivityLogService activityLogService,
                           InstanceAuthorizationService auth) {
        this.instanceRepository = instanceRepository;
        this.participantRepository = participantRepository;
        this.processRepository = processRepository;
        this.riskRepository = riskRepository;
        this.processActivityRepository = processActivityRepository;
        this.biaAssessmentRepository = biaAssessmentRepository;
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.instanceMapper = instanceMapper;
        this.statusTransitionService = statusTransitionService;
        this.activityLogService = activityLogService;
        this.auth = auth;
    }

    @Transactional(readOnly = true)
    public List<InstanceSummaryDto> getInstances(UUID userId) {
        return instanceRepository.findInstancesByUser(userId)
            .stream()
            .map(inst -> {
                var summary = instanceMapper.toSummary(inst);
                summary.setProcessCount(processRepository.findByInstanceIdOrderBySortOrder(inst.getId()).size());
                summary.setRiskCount(riskRepository.findByInstanceId(inst.getId()).size());
                summary.setActivityCount((int) processActivityRepository.countByInstanceId(inst.getId()));
                summary.setBiaAssessmentCount((int) biaAssessmentRepository.countByInstanceId(inst.getId()));
                summary.setReportCount((int) reportRepository.countByInstanceId(inst.getId()));
                return summary;
            })
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public InstanceDto getInstance(UUID id, User user) {
        auth.requireRead(id, user);
        Instance instance = instanceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Instance not found"));
        return instanceMapper.toDto(instance);
    }

    @Transactional
    public InstanceDto createInstance(CreateInstanceRequest req, User user) {
        Organization org = null;
        if (req.getOrganizationName() != null && !req.getOrganizationName().isBlank()) {
            org = organizationRepository.findByName(req.getOrganizationName().trim())
                .orElseGet(() -> organizationRepository.save(new Organization(req.getOrganizationName().trim())));
        }

        var instance = new Instance();
        instance.setOrganization(org);
        instance.setName(req.getName());
        instance.setDescription(req.getDescription());
        instance.setPeriodStart(req.getPeriodStart());
        instance.setPeriodEnd(req.getPeriodEnd());
        instance.setCreatedBy(user);
        instance = instanceRepository.save(instance);

        var participant = new InstanceParticipant();
        participant.setInstance(instance);
        participant.setUser(user);
        participant.setRole("Author");
        participantRepository.save(participant);

        activityLogService.log(instance.getId(), user.getId(), "INSTANCE_CREATED",
            "{\"name\":\"" + instance.getName() + "\"}");

        return instanceMapper.toDto(instance);
    }

    @Transactional
    public InstanceDto updateInstance(UUID id, UpdateInstanceRequest req, User user) {
        auth.requireEdit(id, user);
        Instance instance = instanceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Instance not found"));

        if (req.getName() != null) instance.setName(req.getName());
        if (req.getDescription() != null) instance.setDescription(req.getDescription());
        if (req.getPeriodStart() != null) instance.setPeriodStart(req.getPeriodStart());
        if (req.getPeriodEnd() != null) instance.setPeriodEnd(req.getPeriodEnd());
        instance = instanceRepository.save(instance);

        activityLogService.log(instance.getId(), user.getId(), "INSTANCE_UPDATED", null);
        return instanceMapper.toDto(instance);
    }

    @Transactional
    public void deleteInstance(UUID id, User user) {
        auth.requireDelete(id, user);
        Instance instance = instanceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Instance not found"));
        instanceRepository.delete(instance);
        activityLogService.log(id, user.getId(), "INSTANCE_DELETED", null);
    }

    @Transactional
    public InstanceDto duplicateInstance(UUID id, User user) {
        auth.requireEdit(id, user);
        Instance original = instanceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Instance not found"));

        var copy = new Instance();
        copy.setOrganization(original.getOrganization());
        copy.setName(original.getName() + " (copy)");
        copy.setDescription(original.getDescription());
        copy.setVersion("1.0");
        copy.setStatus(InstanceStatus.IN_PROGRESS);
        copy.setPeriodStart(original.getPeriodStart());
        copy.setPeriodEnd(original.getPeriodEnd());
        copy.setCreatedBy(user);
        copy = instanceRepository.save(copy);

        activityLogService.log(copy.getId(), user.getId(), "INSTANCE_DUPLICATED",
            "{\"source\":\"" + original.getId() + "\"}");

        return instanceMapper.toDto(copy);
    }

    @Transactional
    public InstanceDto transitionStatus(UUID id, String action, String reason, User user) {
        auth.requireTransition(id, user, action);
        Instance instance = instanceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Instance not found"));
        instance = statusTransitionService.transition(instance, action, reason, user);
        return instanceMapper.toDto(instance);
    }

    @Transactional
    public InstanceDto archiveInstance(UUID id, String reason, User user) {
        auth.requireEdit(id, user);
        Instance instance = instanceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Instance not found"));
        instance = statusTransitionService.archive(instance, reason, user);
        return instanceMapper.toDto(instance);
    }

    // ── Participants ──────────────────────────────────────

    @Transactional(readOnly = true)
    public List<InstanceParticipantDto> getParticipants(UUID instanceId) {
        return participantRepository.findByInstanceId(instanceId)
            .stream()
            .map(p -> {
                var dto = new InstanceParticipantDto();
                dto.setId(p.getId());
                dto.setUserId(p.getUser().getId());
                dto.setUserDisplayName(p.getUser().getDisplayName());
                dto.setUserEmail(p.getUser().getEmail());
                dto.setRole(p.getRole());
                dto.setCreatedAt(p.getCreatedAt());
                return dto;
            })
            .collect(Collectors.toList());
    }

    @Transactional
    public InstanceParticipantDto addParticipant(UUID instanceId, AddParticipantRequest req, User currentUser) {
        auth.requireManageParticipants(instanceId, currentUser);
        Instance instance = instanceRepository.findById(instanceId)
            .orElseThrow(() -> new ResourceNotFoundException("Instance not found"));
        User user = userRepository.findById(req.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (participantRepository.existsByInstanceIdAndUserId(instanceId, req.getUserId())) {
            throw new IllegalArgumentException("User is already a participant");
        }

        var participant = new InstanceParticipant();
        participant.setInstance(instance);
        participant.setUser(user);
        participant.setRole(req.getRole());
        participant = participantRepository.save(participant);

        activityLogService.log(instanceId, currentUser.getId(), "PARTICIPANT_ADDED",
            "{\"userId\":\"" + user.getId() + "\"}");

        var dto = new InstanceParticipantDto();
        dto.setId(participant.getId());
        dto.setUserId(user.getId());
        dto.setUserDisplayName(user.getDisplayName());
        dto.setUserEmail(user.getEmail());
        dto.setRole(participant.getRole());
        dto.setCreatedAt(participant.getCreatedAt());
        return dto;
    }

    @Transactional
    public void removeParticipant(UUID instanceId, UUID participantId, User currentUser) {
        auth.requireManageParticipants(instanceId, currentUser);
        InstanceParticipant participant = participantRepository.findById(participantId)
            .orElseThrow(() -> new ResourceNotFoundException("Participant not found"));
        participantRepository.delete(participant);

        activityLogService.log(instanceId, currentUser.getId(), "PARTICIPANT_REMOVED",
            "{\"userId\":\"" + participant.getUser().getId() + "\"}");
    }

    // ── Activity log ──────────────────────────────────────

    @Transactional(readOnly = true)
    public List<InstanceActivityLog> getActivityLog(UUID instanceId) {
        return activityLogService.getActivityLog(instanceId);
    }

    // ── Status history ────────────────────────────────────

    @Transactional(readOnly = true)
    public List<InstanceStatusHistory> getStatusHistory(UUID instanceId) {
        return statusTransitionService.getHistory(instanceId);
    }
}
