package com.biar.service;

import com.biar.entity.Instance;
import com.biar.entity.User;
import com.biar.exception.AccessDeniedException;
import com.biar.exception.ResourceNotFoundException;
import com.biar.repository.InstanceParticipantRepository;
import com.biar.repository.InstanceRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
public class InstanceAuthorizationService {

    private static final Set<String> EDIT_ROLES = Set.of("Author", "Responsible");
    private static final Set<String> PARTICIPANT_MGMT_ROLES = Set.of("Author", "Responsible");
    private static final Set<String> COMPLETE_ROLES = Set.of("Author", "Responsible");
    private static final Set<String> REVIEW_ROLES = Set.of("Reviewer", "Approver");
    private static final Set<String> APPROVE_ROLES = Set.of("Approver");
    private static final Set<String> FINISH_ROLES = Set.of("Author", "Responsible");
    private static final Set<String> ARCHIVE_ROLES = Set.of("Author", "Responsible");

    private static final String DELETE_ROLE = "Author";

    private final InstanceRepository instanceRepository;
    private final InstanceParticipantRepository participantRepository;

    public InstanceAuthorizationService(InstanceRepository instanceRepository,
                                        InstanceParticipantRepository participantRepository) {
        this.instanceRepository = instanceRepository;
        this.participantRepository = participantRepository;
    }

    public void requireRead(UUID instanceId, User user) {
        if (!canAccess(instanceId, user)) {
            throw new AccessDeniedException("You do not have access to this instance");
        }
    }

    public void requireEdit(UUID instanceId, User user) {
        if (isCreator(instanceId, user)) return;
        String role = getParticipantRole(instanceId, user.getId());
        if (role == null || !EDIT_ROLES.contains(role)) {
            throw new AccessDeniedException("You do not have permission to edit this instance");
        }
    }

    public void requireDelete(UUID instanceId, User user) {
        if (isCreator(instanceId, user)) return;
        String role = getParticipantRole(instanceId, user.getId());
        if (!DELETE_ROLE.equals(role)) {
            throw new AccessDeniedException("Only the Author can delete this instance");
        }
    }

    public void requireComment(UUID instanceId, User user) {
        if (isCreator(instanceId, user)) return;
        String role = getParticipantRole(instanceId, user.getId());
        if (role == null) {
            throw new AccessDeniedException("You do not have permission to comment on this instance");
        }
    }

    public void requireManageParticipants(UUID instanceId, User user) {
        if (isCreator(instanceId, user)) return;
        String role = getParticipantRole(instanceId, user.getId());
        if (role == null || !PARTICIPANT_MGMT_ROLES.contains(role)) {
            throw new AccessDeniedException("You do not have permission to manage participants");
        }
    }

    public void requireTransition(UUID instanceId, User user, String action) {
        if (isCreator(instanceId, user)) {
            if (Set.of("review", "approve", "disapprove").contains(action)) {
                throw new AccessDeniedException("You cannot perform this transition on your own instance");
            }
            return;
        }
        String role = getParticipantRole(instanceId, user.getId());
        if (role == null) {
            throw new AccessDeniedException("You do not have permission to change status");
        }
        boolean allowed = switch (action) {
            case "complete" -> COMPLETE_ROLES.contains(role);
            case "review" -> REVIEW_ROLES.contains(role);
            case "approve", "disapprove" -> APPROVE_ROLES.contains(role);
            case "finish" -> FINISH_ROLES.contains(role);
            case "reset", "restore" -> ARCHIVE_ROLES.contains(role);
            default -> false;
        };
        if (!allowed) {
            throw new AccessDeniedException("Your role does not allow the '" + action + "' transition");
        }
    }

    public boolean canAccess(UUID instanceId, User user) {
        if (isCreator(instanceId, user)) return true;
        return getParticipantRole(instanceId, user.getId()) != null;
    }

    private boolean isCreator(UUID instanceId, User user) {
        Instance instance = instanceRepository.findById(instanceId)
            .orElseThrow(() -> new ResourceNotFoundException("Instance not found"));
        return instance.getCreatedBy().getId().equals(user.getId());
    }

    private String getParticipantRole(UUID instanceId, UUID userId) {
        return participantRepository.findByInstanceIdAndUserId(instanceId, userId)
            .map(p -> p.getRole())
            .orElse(null);
    }
}
