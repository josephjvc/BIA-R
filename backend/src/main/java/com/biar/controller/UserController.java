package com.biar.controller;

import com.biar.dto.user.UpdateProfileRequest;
import com.biar.dto.UserDto;
import com.biar.entity.User;
import com.biar.mapper.UserMapper;
import com.biar.repository.UserRepository;
import com.biar.security.CurrentUser;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserController(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getProfile(@CurrentUser User user) {
        return ResponseEntity.ok(userMapper.toDto(user));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDto> updateProfile(@Valid @RequestBody UpdateProfileRequest req,
                                                   @CurrentUser User user) {
        if (req.getDisplayName() != null) user.setDisplayName(req.getDisplayName());
        if (req.getEmail() != null) user.setEmail(req.getEmail());
        userRepository.save(user);
        return ResponseEntity.ok(userMapper.toDto(user));
    }
}
