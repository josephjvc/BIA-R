package com.biar.controller;

import com.biar.dto.dashboard.DashboardDto;
import com.biar.entity.User;
import com.biar.security.CurrentUser;
import com.biar.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/instances/{instanceId}/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<DashboardDto> getDashboard(@PathVariable UUID instanceId,
                                                      @CurrentUser User user) {
        return ResponseEntity.ok(dashboardService.getDashboard(instanceId, user));
    }
}
