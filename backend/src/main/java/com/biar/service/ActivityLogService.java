package com.biar.service;

import com.biar.entity.Instance;
import com.biar.entity.InstanceActivityLog;
import com.biar.entity.User;
import com.biar.repository.InstanceActivityLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ActivityLogService {

    private final InstanceActivityLogRepository logRepository;

    public ActivityLogService(InstanceActivityLogRepository logRepository) {
        this.logRepository = logRepository;
    }

    @Transactional
    public void log(UUID instanceId, UUID userId, String action, String details) {
        var log = new InstanceActivityLog();
        var instance = new Instance();
        instance.setId(instanceId);
        var user = new User();
        user.setId(userId);
        log.setInstance(instance);
        log.setUser(user);
        log.setAction(action);
        log.setDetails(details);
        logRepository.save(log);
    }

    @Transactional(readOnly = true)
    public List<InstanceActivityLog> getActivityLog(UUID instanceId) {
        return logRepository.findByInstanceIdOrderByCreatedAtDesc(instanceId);
    }
}
