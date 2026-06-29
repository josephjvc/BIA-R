package com.biar.controller;

import com.biar.dto.context.*;
import com.biar.entity.User;
import com.biar.security.CurrentUser;
import com.biar.service.ContextService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/instances/{instanceId}/processes")
@Tag(name = "Context", description = "Organizational context - processes and activities")
public class ContextController {

    private final ContextService contextService;

    public ContextController(ContextService contextService) {
        this.contextService = contextService;
    }

    @GetMapping
    @Operation(summary = "List processes for an instance")
    public ResponseEntity<List<BusinessProcessDto>> getProcesses(@PathVariable UUID instanceId) {
        return ResponseEntity.ok(contextService.getProcesses(instanceId));
    }

    @PostMapping
    @Operation(summary = "Create a process")
    public ResponseEntity<BusinessProcessDto> createProcess(@PathVariable UUID instanceId,
                                                             @Valid @RequestBody CreateProcessRequest req,
                                                             @CurrentUser User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(contextService.createProcess(instanceId, req, user));
    }

    @GetMapping("/{processId}")
    public ResponseEntity<BusinessProcessDto> getProcess(@PathVariable UUID instanceId,
                                                          @PathVariable UUID processId) {
        return ResponseEntity.ok(contextService.getProcess(instanceId, processId));
    }

    @PutMapping("/{processId}")
    public ResponseEntity<BusinessProcessDto> updateProcess(@PathVariable UUID instanceId,
                                                             @PathVariable UUID processId,
                                                             @Valid @RequestBody UpdateProcessRequest req,
                                                             @CurrentUser User user) {
        return ResponseEntity.ok(contextService.updateProcess(instanceId, processId, req, user));
    }

    @DeleteMapping("/{processId}")
    public ResponseEntity<Void> deleteProcess(@PathVariable UUID instanceId,
                                               @PathVariable UUID processId,
                                               @CurrentUser User user) {
        contextService.deleteProcess(instanceId, processId, user);
        return ResponseEntity.noContent().build();
    }

    // ── Activities ───────────────────────────────────────

    @PostMapping("/{processId}/activities")
    public ResponseEntity<ProcessActivityDto> createActivity(@PathVariable UUID instanceId,
                                                              @PathVariable UUID processId,
                                                              @Valid @RequestBody CreateActivityRequest req,
                                                              @CurrentUser User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(contextService.createActivity(instanceId, processId, req, user));
    }

    @PutMapping("/{processId}/activities/{activityId}")
    public ResponseEntity<ProcessActivityDto> updateActivity(@PathVariable UUID instanceId,
                                                              @PathVariable UUID processId,
                                                              @PathVariable UUID activityId,
                                                              @Valid @RequestBody UpdateActivityRequest req,
                                                              @CurrentUser User user) {
        return ResponseEntity.ok(
            contextService.updateActivity(instanceId, processId, activityId, req, user));
    }

    @DeleteMapping("/{processId}/activities/{activityId}")
    public ResponseEntity<Void> deleteActivity(@PathVariable UUID instanceId,
                                                @PathVariable UUID processId,
                                                @PathVariable UUID activityId,
                                                @CurrentUser User user) {
        contextService.deleteActivity(instanceId, processId, activityId, user);
        return ResponseEntity.noContent().build();
    }
}
