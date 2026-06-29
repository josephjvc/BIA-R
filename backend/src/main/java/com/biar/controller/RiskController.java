package com.biar.controller;

import com.biar.dto.risk.*;
import com.biar.entity.User;
import com.biar.security.CurrentUser;
import com.biar.service.RiskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/instances/{instanceId}/risks")
public class RiskController {

    private final RiskService riskService;

    public RiskController(RiskService riskService) {
        this.riskService = riskService;
    }

    @GetMapping
    public ResponseEntity<List<RiskDto>> getRisks(@PathVariable UUID instanceId) {
        return ResponseEntity.ok(riskService.getRisks(instanceId));
    }

    @PostMapping
    public ResponseEntity<RiskDto> createRisk(@PathVariable UUID instanceId,
                                               @Valid @RequestBody CreateRiskRequest req,
                                               @CurrentUser User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(riskService.createRisk(instanceId, req, user));
    }

    @GetMapping("/{riskId}")
    public ResponseEntity<RiskDto> getRisk(@PathVariable UUID instanceId,
                                            @PathVariable UUID riskId) {
        return ResponseEntity.ok(riskService.getRisk(instanceId, riskId));
    }

    @PutMapping("/{riskId}")
    public ResponseEntity<RiskDto> updateRisk(@PathVariable UUID instanceId,
                                                @PathVariable UUID riskId,
                                                @Valid @RequestBody UpdateRiskRequest req,
                                                @CurrentUser User user) {
        return ResponseEntity.ok(riskService.updateRisk(instanceId, riskId, req, user));
    }

    @DeleteMapping("/{riskId}")
    public ResponseEntity<Void> deleteRisk(@PathVariable UUID instanceId,
                                            @PathVariable UUID riskId,
                                            @CurrentUser User user) {
        riskService.deleteRisk(instanceId, riskId, user);
        return ResponseEntity.noContent().build();
    }
}
