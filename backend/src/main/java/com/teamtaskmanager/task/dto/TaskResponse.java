package com.teamtaskmanager.task.dto;

import com.teamtaskmanager.task.TaskStatus;
import com.teamtaskmanager.user.dto.UserSummary;

import java.time.LocalDate;

public record TaskResponse(
		Long id,
		String title,
		String description,
		Long projectId,
		String projectTitle,
		UserSummary assignedTo,
		TaskStatus status,
		LocalDate dueDate,
		boolean overdue
) {
}

