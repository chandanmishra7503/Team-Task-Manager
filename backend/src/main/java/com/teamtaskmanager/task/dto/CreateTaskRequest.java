package com.teamtaskmanager.task.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record CreateTaskRequest(
		@NotBlank String title,
		String description,
		@NotNull Long assignedToUserId,
		@NotNull Long projectId,
		LocalDate dueDate
) {
}

