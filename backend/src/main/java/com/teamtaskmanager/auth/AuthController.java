package com.teamtaskmanager.auth;

import com.teamtaskmanager.auth.dto.AuthResponse;
import com.teamtaskmanager.auth.dto.LoginRequest;
import com.teamtaskmanager.auth.dto.SignupRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	private final AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/signup")
	public AuthResponse signup(@Valid @RequestBody SignupRequest req) {
		return authService.signup(req);
	}

	@PostMapping("/login")
	public AuthResponse login(@Valid @RequestBody LoginRequest req) {
		return authService.login(req);
	}
}

