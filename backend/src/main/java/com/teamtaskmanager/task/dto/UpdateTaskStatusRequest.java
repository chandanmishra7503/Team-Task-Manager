package com.teamtaskmanager.task.dto;

import com.teamtaskmanager.task.TaskStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateTaskStatusRequest(
		@NotNull TaskStatus status
) {
}

