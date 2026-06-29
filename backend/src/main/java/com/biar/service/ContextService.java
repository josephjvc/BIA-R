package com.biar.service;

import com.biar.dto.context.*;
import com.biar.entity.*;
import com.biar.exception.ResourceNotFoundException;
import com.biar.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ContextService {

    private final BusinessProcessRepository processRepository;
    private final ProcessActivityRepository activityRepository;
    private final InstanceRepository instanceRepository;
    private final StatusTransitionService statusTransitionService;
    private final ActivityLogService activityLogService;

    public ContextService(BusinessProcessRepository processRepository,
                          ProcessActivityRepository activityRepository,
                          InstanceRepository instanceRepository,
                          StatusTransitionService statusTransitionService,
                          ActivityLogService activityLogService) {
        this.processRepository = processRepository;
        this.activityRepository = activityRepository;
        this.instanceRepository = instanceRepository;
        this.statusTransitionService = statusTransitionService;
        this.activityLogService = activityLogService;
    }

    // ── Processes ────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<BusinessProcessDto> getProcesses(UUID instanceId) {
        return processRepository.findByInstanceIdOrderBySortOrder(instanceId)
            .stream()
            .map(this::toProcessDto)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BusinessProcessDto getProcess(UUID instanceId, UUID processId) {
        BusinessProcess process = processRepository.findById(processId)
            .orElseThrow(() -> new ResourceNotFoundException("Process not found"));
        return toProcessDto(process);
    }

    @Transactional
    public BusinessProcessDto createProcess(UUID instanceId, CreateProcessRequest req, User user) {
        Instance instance = instanceRepository.findById(instanceId)
            .orElseThrow(() -> new ResourceNotFoundException("Instance not found"));

        var process = new BusinessProcess();
        process.setInstance(instance);
        applyCreate(process, req);
        process = processRepository.save(process);

        resetStatusIfNeeded(instance, user, "process_created");
        activityLogService.log(instanceId, user.getId(), "PROCESS_CREATED",
            "{\"processId\":\"" + process.getId() + "\"}");

        return toProcessDto(process);
    }

    @Transactional
    public BusinessProcessDto updateProcess(UUID instanceId, UUID processId, UpdateProcessRequest req, User user) {
        BusinessProcess process = processRepository.findById(processId)
            .orElseThrow(() -> new ResourceNotFoundException("Process not found"));
        applyUpdate(process, req);
        process = processRepository.save(process);

        Instance instance = process.getInstance();
        resetStatusIfNeeded(instance, user, "process_updated");

        return toProcessDto(process);
    }

    @Transactional
    public void deleteProcess(UUID instanceId, UUID processId, User user) {
        BusinessProcess process = processRepository.findById(processId)
            .orElseThrow(() -> new ResourceNotFoundException("Process not found"));
        processRepository.delete(process);

        Instance instance = process.getInstance();
        resetStatusIfNeeded(instance, user, "process_deleted");
    }

    // ── Activities ───────────────────────────────────────

    @Transactional
    public ProcessActivityDto createActivity(UUID instanceId, UUID processId, CreateActivityRequest req, User user) {
        BusinessProcess process = processRepository.findById(processId)
            .orElseThrow(() -> new ResourceNotFoundException("Process not found"));

        var activity = new ProcessActivity();
        activity.setProcess(process);
        activity.setName(req.getName());
        activity.setCriticalTimePeriod(req.getCriticalTimePeriod());
        activity.setNotes(req.getNotes());
        activity.setSortOrder(req.getSortOrder() != null ? req.getSortOrder() : 0);
        activity = activityRepository.save(activity);

        resetStatusIfNeeded(process.getInstance(), user, "activity_created");
        return toActivityDto(activity);
    }

    @Transactional
    public ProcessActivityDto updateActivity(UUID instanceId, UUID processId, UUID activityId,
                                              UpdateActivityRequest req, User user) {
        ProcessActivity activity = activityRepository.findById(activityId)
            .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));

        if (req.getName() != null) activity.setName(req.getName());
        if (req.getCriticalTimePeriod() != null) activity.setCriticalTimePeriod(req.getCriticalTimePeriod());
        if (req.getNotes() != null) activity.setNotes(req.getNotes());
        if (req.getSortOrder() != null) activity.setSortOrder(req.getSortOrder());
        activity = activityRepository.save(activity);

        Instance instance = activity.getProcess().getInstance();
        resetStatusIfNeeded(instance, user, "activity_updated");

        return toActivityDto(activity);
    }

    @Transactional
    public void deleteActivity(UUID instanceId, UUID processId, UUID activityId, User user) {
        ProcessActivity activity = activityRepository.findById(activityId)
            .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));
        activityRepository.delete(activity);

        Instance instance = activity.getProcess().getInstance();
        resetStatusIfNeeded(instance, user, "activity_deleted");
    }

    // ── Helpers ──────────────────────────────────────────

    private void resetStatusIfNeeded(Instance instance, User user, String reason) {
        if (instance.getStatus() != InstanceStatus.IN_PROGRESS && instance.getStatus() != InstanceStatus.ARCHIVED) {
            statusTransitionService.resetToInProgress(instance, "Critical change: " + reason, user);
        }
    }

    private BusinessProcessDto toProcessDto(BusinessProcess p) {
        var dto = new BusinessProcessDto();
        dto.setId(p.getId());
        dto.setInstanceId(p.getInstance().getId());
        dto.setName(p.getName());
        dto.setBusinessUnit(p.getBusinessUnit());
        dto.setOwner(p.getOwner());
        dto.setDescription(p.getDescription());
        dto.setKeyObjectives(p.getKeyObjectives());
        dto.setCountry(p.getCountry());
        dto.setRegion(p.getRegion());
        dto.setSites(p.getSites());
        dto.setEmployeesCount(p.getEmployeesCount());
        dto.setBiaPeriodicity(p.getBiaPeriodicity());
        dto.setCriticalTimePeriod(p.getCriticalTimePeriod());
        dto.setCriticality(p.getCriticality());
        dto.setStatus(p.getStatus());
        dto.setNotes(p.getNotes());
        dto.setSortOrder(p.getSortOrder());
        dto.setActivities(
            activityRepository.findByProcessIdOrderBySortOrder(p.getId())
                .stream().map(this::toActivityDto).collect(Collectors.toList())
        );
        dto.setCreatedAt(p.getCreatedAt());
        dto.setUpdatedAt(p.getUpdatedAt());
        return dto;
    }

    private ProcessActivityDto toActivityDto(ProcessActivity a) {
        var dto = new ProcessActivityDto();
        dto.setId(a.getId());
        dto.setProcessId(a.getProcess().getId());
        dto.setName(a.getName());
        dto.setCriticalTimePeriod(a.getCriticalTimePeriod());
        dto.setNotes(a.getNotes());
        dto.setSortOrder(a.getSortOrder());
        dto.setCreatedAt(a.getCreatedAt());
        dto.setUpdatedAt(a.getUpdatedAt());
        return dto;
    }

    private void applyCreate(BusinessProcess p, CreateProcessRequest req) {
        p.setName(req.getName());
        p.setBusinessUnit(req.getBusinessUnit());
        p.setOwner(req.getOwner());
        p.setDescription(req.getDescription());
        p.setKeyObjectives(req.getKeyObjectives());
        p.setCountry(req.getCountry());
        p.setRegion(req.getRegion());
        p.setSites(req.getSites());
        p.setEmployeesCount(req.getEmployeesCount());
        p.setBiaPeriodicity(req.getBiaPeriodicity());
        p.setCriticalTimePeriod(req.getCriticalTimePeriod());
        p.setCriticality(req.getCriticality());
        p.setNotes(req.getNotes());
        p.setSortOrder(req.getSortOrder() != null ? req.getSortOrder() : 0);
    }

    private void applyUpdate(BusinessProcess p, UpdateProcessRequest req) {
        if (req.getName() != null) p.setName(req.getName());
        if (req.getBusinessUnit() != null) p.setBusinessUnit(req.getBusinessUnit());
        if (req.getOwner() != null) p.setOwner(req.getOwner());
        if (req.getDescription() != null) p.setDescription(req.getDescription());
        if (req.getKeyObjectives() != null) p.setKeyObjectives(req.getKeyObjectives());
        if (req.getCountry() != null) p.setCountry(req.getCountry());
        if (req.getRegion() != null) p.setRegion(req.getRegion());
        if (req.getSites() != null) p.setSites(req.getSites());
        if (req.getEmployeesCount() != null) p.setEmployeesCount(req.getEmployeesCount());
        if (req.getBiaPeriodicity() != null) p.setBiaPeriodicity(req.getBiaPeriodicity());
        if (req.getCriticalTimePeriod() != null) p.setCriticalTimePeriod(req.getCriticalTimePeriod());
        if (req.getCriticality() != null) p.setCriticality(req.getCriticality());
        if (req.getNotes() != null) p.setNotes(req.getNotes());
        if (req.getSortOrder() != null) p.setSortOrder(req.getSortOrder());
    }
}
