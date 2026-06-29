package com.biar.controller;

import com.biar.dto.bia.*;
import com.biar.entity.User;
import com.biar.security.CurrentUser;
import com.biar.service.BiaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/instances/{instanceId}/bia")
public class BiaController {

    private final BiaService biaService;

    public BiaController(BiaService biaService) {
        this.biaService = biaService;
    }

    @GetMapping
    public ResponseEntity<List<BiaAssessmentDto>> getAssessments(@PathVariable UUID instanceId) {
        return ResponseEntity.ok(biaService.getAssessments(instanceId));
    }

    @GetMapping("/{processId}")
    public ResponseEntity<BiaAssessmentDto> getAssessment(@PathVariable UUID instanceId,
                                                           @PathVariable UUID processId) {
        return ResponseEntity.ok(biaService.getAssessment(instanceId, processId));
    }

    @PutMapping("/{processId}")
    public ResponseEntity<BiaAssessmentDto> upsertAssessment(@PathVariable UUID instanceId,
                                                              @PathVariable UUID processId,
                                                              @Valid @RequestBody UpsertBiaRequest req,
                                                              @CurrentUser User user) {
        return ResponseEntity.ok(biaService.upsertAssessment(instanceId, processId, req, user));
    }
}
