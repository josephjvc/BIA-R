package com.biar.controller;

import com.biar.dto.export.*;
import com.biar.entity.User;
import com.biar.security.CurrentUser;
import com.biar.service.ExportService;
import jakarta.validation.Valid;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/instances/{instanceId}/exports")
public class ExportController {

    private final ExportService exportService;

    public ExportController(ExportService exportService) {
        this.exportService = exportService;
    }

    @GetMapping
    public ResponseEntity<List<ExportDto>> getExports(@PathVariable UUID instanceId) {
        return ResponseEntity.ok(exportService.getExports(instanceId));
    }

    @PostMapping
    public ResponseEntity<ExportDto> createExport(@PathVariable UUID instanceId,
                                                   @Valid @RequestBody CreateExportRequest req,
                                                   @CurrentUser User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(exportService.createExport(instanceId, req, user));
    }

    @GetMapping("/{exportId}/download")
    public ResponseEntity<Resource> downloadExport(@PathVariable UUID instanceId,
                                                    @PathVariable UUID exportId) {
        var filePath = exportService.getExportFilePath(exportId);
        var resource = new FileSystemResource(filePath);
        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType("text/csv"))
            .header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + filePath.getFileName().toString() + "\"")
            .body(resource);
    }
}
