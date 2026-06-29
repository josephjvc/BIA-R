package com.biar.controller;

import com.biar.dto.report.*;
import com.biar.entity.User;
import com.biar.security.CurrentUser;
import com.biar.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/instances/{instanceId}/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    public ResponseEntity<List<ReportDto>> getReports(@PathVariable UUID instanceId) {
        return ResponseEntity.ok(reportService.getReports(instanceId));
    }

    @PostMapping
    public ResponseEntity<ReportDto> generateReport(@PathVariable UUID instanceId,
                                                     @Valid @RequestBody GenerateReportRequest req,
                                                     @CurrentUser User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(reportService.generateReport(instanceId, req, user));
    }

    @GetMapping("/{reportId}")
    public ResponseEntity<ReportDto> getReport(@PathVariable UUID instanceId,
                                                @PathVariable UUID reportId) {
        return ResponseEntity.ok(reportService.getReport(instanceId, reportId));
    }
}
