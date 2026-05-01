package com.teamtaskmanager.project.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record CreateProjectRequest(
		@NotBlank String title,
		String description,
		List<Long> memberIds
) {
}

