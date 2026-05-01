package com.teamtaskmanager.project.dto;

import com.teamtaskmanager.user.dto.UserSummary;

import java.util.List;

public record ProjectResponse(
		Long id,
		String title,
		String description,
		UserSummary createdBy,
		List<UserSummary> teamMembers
) {
}

