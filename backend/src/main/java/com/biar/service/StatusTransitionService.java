package com.biar.service;

import com.biar.entity.Instance;
import com.biar.entity.InstanceStatus;
import com.biar.entity.InstanceStatusHistory;
import com.biar.entity.User;
import com.biar.exception.InvalidStatusTransitionException;
import com.biar.repository.InstanceRepository;
import com.biar.repository.InstanceStatusHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.Set;

@Service
public class StatusTransitionService {

    private final InstanceRepository instanceRepository;
    private final InstanceStatusHistoryRepository historyRepository;
    private final ActivityLogService activityLogService;

    private static final Map<InstanceStatus, Set<StatusAction>> TRANSITIONS = new EnumMap<>(InstanceStatus.class);

    record StatusAction(String action, InstanceStatus toStatus) {}

    static {
        TRANSITIONS.put(InstanceStatus.IN_PROGRESS, Set.of(
            new StatusAction("complete", InstanceStatus.COMPLETED)
        ));
        TRANSITIONS.put(InstanceStatus.COMPLETED, Set.of(
            new StatusAction("review", InstanceStatus.REVIEWED)
        ));
        TRANSITIONS.put(InstanceStatus.REVIEWED, Set.of(
            new StatusAction("approve", InstanceStatus.APPROVED),
            new StatusAction("disapprove", InstanceStatus.DISAPPROVED)
        ));
        TRANSITIONS.put(InstanceStatus.APPROVED, Set.of(
            new StatusAction("finish", InstanceStatus.FINISHED)
        ));
        TRANSITIONS.put(InstanceStatus.DISAPPROVED, Set.of(
            new StatusAction("reset", InstanceStatus.IN_PROGRESS)
        ));
    }

    public StatusTransitionService(InstanceRepository instanceRepository,
                                    InstanceStatusHistoryRepository historyRepository,
                                    ActivityLogService activityLogService) {
        this.instanceRepository = instanceRepository;
        this.historyRepository = historyRepository;
        this.activityLogService = activityLogService;
    }

    @Transactional
    public Instance transition(Instance instance, String action, String reason, User user) {
        InstanceStatus current = instance.getStatus();

        if (current == InstanceStatus.ARCHIVED) {
            if ("restore".equals(action)) {
                InstanceStatus restored = historyRepository
                    .findByInstanceIdOrderByCreatedAtDesc(instance.getId())
                    .stream()
                    .findFirst()
                    .map(h -> h.getFromStatus())
                    .orElse(InstanceStatus.IN_PROGRESS);
                return applyTransition(instance, restored, reason, user);
            }
            throw new InvalidStatusTransitionException("Archived instances can only be restored");
        }

        Set<StatusAction> allowed = TRANSITIONS.get(current);
        if (allowed == null) {
            throw new InvalidStatusTransitionException(
                "No transitions allowed from status: " + current.getValue());
        }

        StatusAction target = allowed.stream()
            .filter(a -> a.action().equals(action))
            .findFirst()
            .orElseThrow(() -> new InvalidStatusTransitionException(
                "Action '" + action + "' is not allowed from status: " + current.getValue()));

        return applyTransition(instance, target.toStatus(), reason, user);
    }

    @Transactional
    public Instance archive(Instance instance, String reason, User user) {
        return applyTransition(instance, InstanceStatus.ARCHIVED, reason, user);
    }

    @Transactional
    public Instance resetToInProgress(Instance instance, String reason, User user) {
        if (instance.getStatus() == InstanceStatus.IN_PROGRESS) {
            return instance;
        }
        return applyTransition(instance, InstanceStatus.IN_PROGRESS, reason, user);
    }

    private Instance applyTransition(Instance instance, InstanceStatus toStatus, String reason, User user) {
        InstanceStatus fromStatus = instance.getStatus();
        instance.setStatus(toStatus);
        instance = instanceRepository.save(instance);

        var history = new InstanceStatusHistory();
        history.setInstance(instance);
        history.setFromStatus(fromStatus);
        history.setToStatus(toStatus);
        history.setChangedBy(user);
        history.setReason(reason);
        historyRepository.save(history);

        String details = String.format("{\"from\":\"%s\",\"to\":\"%s\"}", fromStatus.getValue(), toStatus.getValue());
        activityLogService.log(instance.getId(), user.getId(), "STATUS_CHANGE", details);

        return instance;
    }

    public List<InstanceStatusHistory> getHistory(UUID instanceId) {
        return historyRepository.findByInstanceIdOrderByCreatedAtDesc(instanceId);
    }
}
