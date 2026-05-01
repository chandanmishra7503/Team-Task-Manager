package com.teamtaskmanager.dashboard.dto;

import com.teamtaskmanager.task.TaskStatus;
import com.teamtaskmanager.task.dto.TaskResponse;

import java.util.List;
import java.util.Map;

public record DashboardResponse(
		long totalTasks,
		Map<TaskStatus, Long> statusCounts,
		long overdueTasks,
		List<TaskResponse> tasks,
		List<TaskResponse> overdue
) {
}

