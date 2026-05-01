package com.teamtaskmanager.dashboard;

import com.teamtaskmanager.dashboard.dto.DashboardResponse;
import com.teamtaskmanager.task.TaskService;
import com.teamtaskmanager.task.TaskStatus;
import com.teamtaskmanager.task.dto.TaskResponse;
import com.teamtaskmanager.user.User;
import org.springframework.stereotype.Service;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {
	private final TaskService taskService;

	public DashboardService(TaskService taskService) {
		this.taskService = taskService;
	}

	public DashboardResponse get(User me, TaskStatus status, Long projectId) {
		List<TaskResponse> filtered = taskService.search(me, status, projectId);
		List<TaskResponse> overdue = taskService.overdue(me);

		Map<TaskStatus, Long> statusCounts = new EnumMap<>(TaskStatus.class);
		for (TaskStatus s : TaskStatus.values()) {
			statusCounts.put(s, 0L);
		}

		List<TaskResponse> allInScope = taskService.search(me, null, projectId);
		for (TaskResponse tr : allInScope) {
			statusCounts.put(tr.status(), statusCounts.get(tr.status()) + 1);
		}

		long overdueCount = overdue.stream()
				.filter(t -> projectId == null || t.projectId().equals(projectId))
				.count();

		return new DashboardResponse(
				allInScope.size(),
				Map.copyOf(statusCounts),
				overdueCount,
				filtered,
				overdue
		);
	}
}

