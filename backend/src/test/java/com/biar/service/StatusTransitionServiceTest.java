package com.biar.service;

import com.biar.entity.Instance;
import com.biar.entity.InstanceStatus;
import com.biar.entity.InstanceStatusHistory;
import com.biar.entity.User;
import com.biar.exception.InvalidStatusTransitionException;
import com.biar.repository.InstanceRepository;
import com.biar.repository.InstanceStatusHistoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StatusTransitionServiceTest {

    @Mock private InstanceRepository instanceRepository;
    @Mock private InstanceStatusHistoryRepository historyRepository;
    @Mock private ActivityLogService activityLogService;

    private StatusTransitionService service;

    @BeforeEach
    void setUp() {
        service = new StatusTransitionService(instanceRepository, historyRepository, activityLogService);
    }

    @Test
    void shouldCompleteInstance() {
        var user = new User();
        user.setId(UUID.randomUUID());

        var instance = new Instance();
        instance.setId(UUID.randomUUID());
        instance.setName("Test");
        instance.setCreatedBy(user);
        instance.setStatus(InstanceStatus.IN_PROGRESS);

        when(instanceRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        var result = service.transition(instance, "complete", null, user);

        assertEquals(InstanceStatus.COMPLETED, result.getStatus());
    }

    @Test
    void shouldResetToInProgress() {
        var user = new User();
        user.setId(UUID.randomUUID());

        var instance = new Instance();
        instance.setId(UUID.randomUUID());
        instance.setName("Test");
        instance.setCreatedBy(user);
        instance.setStatus(InstanceStatus.COMPLETED);

        when(instanceRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        var result = service.resetToInProgress(instance, "critical content changed", user);

        assertEquals(InstanceStatus.IN_PROGRESS, result.getStatus());
    }

    @Test
    void shouldThrowOnInvalidTransition() {
        var user = new User();
        user.setId(UUID.randomUUID());

        var instance = new Instance();
        instance.setId(UUID.randomUUID());
        instance.setName("Test");
        instance.setCreatedBy(user);
        instance.setStatus(InstanceStatus.IN_PROGRESS);

        assertThrows(InvalidStatusTransitionException.class,
            () -> service.transition(instance, "approve", null, user));
    }
}
