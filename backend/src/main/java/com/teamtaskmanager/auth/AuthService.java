package com.teamtaskmanager.auth;

import com.teamtaskmanager.auth.dto.AuthResponse;
import com.teamtaskmanager.auth.dto.LoginRequest;
import com.teamtaskmanager.auth.dto.SignupRequest;
import com.teamtaskmanager.common.exception.BadRequestException;
import com.teamtaskmanager.security.JwtService;
import com.teamtaskmanager.user.Role;
import com.teamtaskmanager.user.User;
import com.teamtaskmanager.user.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }
    public AuthResponse signup(SignupRequest req) {

        if (userRepository.existsByEmailIgnoreCase(req.email())) {
            throw new BadRequestException("Email already registered");
        }

        Role role = "ADMIN".equalsIgnoreCase(req.role()) ? Role.ADMIN : Role.MEMBER;

        User user = new User(
                req.email().trim().toLowerCase(),
                passwordEncoder.encode(req.password()),
                role
        );

        User saved = userRepository.save(user);

        String token = jwtService.generateToken(saved.getEmail(), Map.of(
                "userId", saved.getId(),
                "role", saved.getRole().name()
        ));

        return new AuthResponse(
                token,
                saved.getId(),
                saved.getEmail(),
                saved.getRole()
        );
    }

    public AuthResponse login(LoginRequest req) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password())
        );

        User user = userRepository.findByEmailIgnoreCase(req.email())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        String token = jwtService.generateToken(user.getEmail(), Map.of(
                "userId", user.getId(),
                "role", user.getRole().name()
        ));

        return new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getRole()
        );
    }
}