package com.biar.service;

import com.biar.dto.UserDto;
import com.biar.dto.auth.AuthResponse;
import com.biar.dto.auth.LoginRequest;
import com.biar.dto.auth.RegisterRequest;
import com.biar.entity.Organization;
import com.biar.entity.User;
import com.biar.exception.DuplicateEmailException;
import com.biar.mapper.UserMapper;
import com.biar.repository.OrganizationRepository;
import com.biar.repository.UserRepository;
import com.biar.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final UserMapper userMapper;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       OrganizationRepository organizationRepository,
                       UserMapper userMapper,
                       JwtService jwtService,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.userMapper = userMapper;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new DuplicateEmailException("This email is already registered");
        }

        Organization org = null;
        if (req.getOrganizationName() != null && !req.getOrganizationName().isBlank()) {
            org = organizationRepository.findByName(req.getOrganizationName().trim())
                .orElseGet(() -> organizationRepository.save(new Organization(req.getOrganizationName().trim())));
        }

        User user = userMapper.toEntity(req);
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setOrganization(org);
        user = userRepository.save(user);

        String token = jwtService.generateAccessToken(user);
        UserDto userDto = userMapper.toDto(user);
        return new AuthResponse(token, userDto);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtService.generateAccessToken(user);
        UserDto userDto = userMapper.toDto(user);
        return new AuthResponse(token, userDto);
    }
}
