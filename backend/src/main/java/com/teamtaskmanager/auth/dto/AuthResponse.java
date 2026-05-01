package com.teamtaskmanager.auth.dto;

import com.teamtaskmanager.user.Role;

public record AuthResponse(
		String token,
		Long userId,
		String email,
		Role role
) {
}

