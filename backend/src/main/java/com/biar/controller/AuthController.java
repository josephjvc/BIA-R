package com.biar.controller;

import com.biar.dto.auth.AuthResponse;
import com.biar.dto.auth.LoginRequest;
import com.biar.dto.auth.RegisterRequest;
import com.biar.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Auth", description = "Authentication and user registration")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    @ApiResponse(responseCode = "201", description = "User registered successfully")
    @ApiResponse(responseCode = "409", description = "Email already registered")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        logger.info("Registration attempt for email: {}", req.getEmail());
        AuthResponse res = authService.register(req);
        logger.info("Registration successful for user: {}", res.getUser().getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user")
    @ApiResponse(responseCode = "200", description = "Login successful")
    @ApiResponse(responseCode = "401", description = "Invalid credentials")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        logger.info("Login attempt for email: {}", req.getEmail());
        AuthResponse res = authService.login(req);
        logger.info("Login successful for user: {}", res.getUser().getId());
        return ResponseEntity.ok(res);
    }
}
