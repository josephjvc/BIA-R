package com.biar.security;

import com.biar.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtService {

    private final SecretKey key;
    private final long expiration;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expiration
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiration = expiration;
    }

    public String generateAccessToken(User user) {
        Date now = new Date();
        return Jwts.builder()
                .issuer("biar-api")
                .subject(user.getId().toString())
                .audience().add("biar-frontend").and()
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expiration))
                .id(UUID.randomUUID().toString())
                .signWith(key)
                .compact();
    }

    public Claims validateToken(String token) {
        return Jwts.parser()
                .requireIssuer("biar-api")
                .requireAudience("biar-frontend")
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
