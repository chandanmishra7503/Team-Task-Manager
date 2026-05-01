package com.teamtaskmanager.user.dto;

import com.teamtaskmanager.user.Role;

public record MeResponse(
		Long id,
		String email,
		Role role
) {
}

