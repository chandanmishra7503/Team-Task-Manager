package com.teamtaskmanager.user.dto;

import com.teamtaskmanager.user.Role;

public record UserSummary(
		Long id,
		String email,
		Role role
) {
}

