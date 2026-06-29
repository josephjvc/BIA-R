package com.biar.service;

import com.biar.security.JwtService;
import com.biar.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService("BVc0W2rZ4sxWxKJKuG4EgG50LGRDHkSSb3mcoU+o9zk=", 86400000L);
    }

    @Test
    void shouldGenerateAndValidateToken() {
        var user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("test@test.com");

        String token = jwtService.generateAccessToken(user);
        assertNotNull(token);

        var claims = jwtService.validateToken(token);
        assertEquals(user.getId().toString(), claims.getSubject());
        assertEquals("biar-api", claims.getIssuer());
    }

    @Test
    void shouldRejectExpiredToken() {
        jwtService = new JwtService("BVc0W2rZ4sxWxKJKuG4EgG50LGRDHkSSb3mcoU+o9zk=", -1L);
        var user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("test@test.com");

        String token = jwtService.generateAccessToken(user);
        assertThrows(Exception.class, () -> jwtService.validateToken(token));
    }
}
