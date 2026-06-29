package com.biar.service;

import com.biar.dto.auth.RegisterRequest;
import com.biar.dto.auth.LoginRequest;
import com.biar.entity.User;
import com.biar.exception.DuplicateEmailException;
import com.biar.mapper.UserMapper;
import com.biar.repository.OrganizationRepository;
import com.biar.repository.UserRepository;
import com.biar.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private OrganizationRepository organizationRepository;
    @Mock private UserMapper userMapper;
    @Mock private JwtService jwtService;

    private PasswordEncoder passwordEncoder;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        authService = new AuthService(userRepository, organizationRepository, userMapper, jwtService, passwordEncoder);
    }

    @Test
    void shouldRegisterUserSuccessfully() {
        var req = new RegisterRequest();
        req.setName("Test");
        req.setLastName("User");
        req.setEmail("test@test.com");
        req.setPassword("password123");

        when(userRepository.existsByEmail(req.getEmail())).thenReturn(false);
        when(userMapper.toEntity(req)).thenReturn(new User());
        when(userRepository.save(any())).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId(UUID.randomUUID());
            return u;
        });
        when(jwtService.generateAccessToken(any())).thenReturn("fake-token");

        var res = authService.register(req);

        assertNotNull(res);
        assertEquals("fake-token", res.getToken());
        verify(userRepository).existsByEmail(req.getEmail());
        verify(userRepository).save(any());
    }

    @Test
    void shouldThrowOnDuplicateEmail() {
        var req = new RegisterRequest();
        req.setEmail("existing@test.com");
        req.setPassword("password123");

        when(userRepository.existsByEmail(req.getEmail())).thenReturn(true);

        assertThrows(DuplicateEmailException.class, () -> authService.register(req));
        verify(userRepository, never()).save(any());
    }

    @Test
    void shouldLoginWithValidCredentials() {
        var req = new LoginRequest();
        req.setEmail("test@test.com");
        req.setPassword("password123");

        var user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("test@test.com");
        user.setPasswordHash(passwordEncoder.encode("password123"));

        when(userRepository.findByEmail(req.getEmail())).thenReturn(Optional.of(user));
        when(jwtService.generateAccessToken(user)).thenReturn("fake-token");

        var res = authService.login(req);
        assertNotNull(res);
        assertEquals("fake-token", res.getToken());
    }

    @Test
    void shouldThrowOnInvalidPassword() {
        var req = new LoginRequest();
        req.setEmail("test@test.com");
        req.setPassword("wrongpassword");

        var user = new User();
        user.setEmail("test@test.com");
        user.setPasswordHash(passwordEncoder.encode("password123"));

        when(userRepository.findByEmail(req.getEmail())).thenReturn(Optional.of(user));

        assertThrows(IllegalArgumentException.class, () -> authService.login(req));
    }
}
