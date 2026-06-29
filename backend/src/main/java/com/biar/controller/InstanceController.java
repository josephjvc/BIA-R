package com.biar.controller;

import com.biar.dto.instance.*;
import com.biar.entity.InstanceActivityLog;
import com.biar.entity.InstanceStatusHistory;
import com.biar.entity.User;
import com.biar.security.CurrentUser;
import com.biar.service.InstanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/instances")
@Tag(name = "Instances", description = "Continuity instance management")
public class InstanceController {

    private final InstanceService instanceService;

    public InstanceController(InstanceService instanceService) {
        this.instanceService = instanceService;
    }

    @GetMapping
    @Operation(summary = "List instances for current user")
    public ResponseEntity<List<InstanceSummaryDto>> getInstances(@CurrentUser User user) {
        return ResponseEntity.ok(instanceService.getInstances(user.getId()));
    }

    @PostMapping
    @Operation(summary = "Create a new instance")
    public ResponseEntity<InstanceDto> createInstance(@Valid @RequestBody CreateInstanceRequest req,
                                                       @CurrentUser User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(instanceService.createInstance(req, user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InstanceDto> getInstance(@PathVariable UUID id, @CurrentUser User user) {
        return ResponseEntity.ok(instanceService.getInstance(id, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InstanceDto> updateInstance(@PathVariable UUID id,
                                                       @Valid @RequestBody UpdateInstanceRequest req,
                                                       @CurrentUser User user) {
        return ResponseEntity.ok(instanceService.updateInstance(id, req, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInstance(@PathVariable UUID id, @CurrentUser User user) {
        instanceService.deleteInstance(id, user);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/duplicate")
    public ResponseEntity<InstanceDto> duplicateInstance(@PathVariable UUID id, @CurrentUser User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(instanceService.duplicateInstance(id, user));
    }

    // ── Status ────────────────────────────────────────────

    @PutMapping("/{id}/status")
    public ResponseEntity<InstanceDto> updateStatus(@PathVariable UUID id,
                                                     @Valid @RequestBody InstanceStatusRequest req,
                                                     @CurrentUser User user) {
        return ResponseEntity.ok(instanceService.transitionStatus(id, req.getAction(), req.getReason(), user));
    }

    @PostMapping("/{id}/archive")
    public ResponseEntity<InstanceDto> archiveInstance(@PathVariable UUID id,
                                                        @RequestBody(required = false) InstanceStatusRequest req,
                                                        @CurrentUser User user) {
        String reason = req != null ? req.getReason() : null;
        return ResponseEntity.ok(instanceService.archiveInstance(id, reason, user));
    }

    // ── Participants ──────────────────────────────────────

    @GetMapping("/{id}/participants")
    public ResponseEntity<List<InstanceParticipantDto>> getParticipants(@PathVariable UUID id,
                                                                          @CurrentUser User user) {
        return ResponseEntity.ok(instanceService.getParticipants(id, user));
    }

    @PostMapping("/{id}/participants")
    public ResponseEntity<InstanceParticipantDto> addParticipant(@PathVariable UUID id,
                                                                   @Valid @RequestBody AddParticipantRequest req,
                                                                   @CurrentUser User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(instanceService.addParticipant(id, req, user));
    }

    @DeleteMapping("/{id}/participants/{participantId}")
    public ResponseEntity<Void> removeParticipant(@PathVariable UUID id,
                                                   @PathVariable UUID participantId,
                                                   @CurrentUser User user) {
        instanceService.removeParticipant(id, participantId, user);
        return ResponseEntity.noContent().build();
    }

    // ── Activity log ──────────────────────────────────────

    @GetMapping("/{id}/activity-log")
    public ResponseEntity<List<InstanceActivityLog>> getActivityLog(@PathVariable UUID id,
                                                                     @CurrentUser User user) {
        return ResponseEntity.ok(instanceService.getActivityLog(id, user));
    }

    // ── Status history ────────────────────────────────────

    @GetMapping("/{id}/history")
    public ResponseEntity<List<InstanceStatusHistory>> getStatusHistory(@PathVariable UUID id,
                                                                         @CurrentUser User user) {
        return ResponseEntity.ok(instanceService.getStatusHistory(id, user));
    }
}
