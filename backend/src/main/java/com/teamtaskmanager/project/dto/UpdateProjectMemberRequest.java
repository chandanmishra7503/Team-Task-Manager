package com.teamtaskmanager.project.dto;

import jakarta.validation.constraints.NotNull;

public record UpdateProjectMemberRequest(
		@NotNull Long userId
) {
}

