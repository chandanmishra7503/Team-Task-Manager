package com.teamtaskmanager.dashboard;

import com.teamtaskmanager.dashboard.dto.DashboardResponse;
import com.teamtaskmanager.security.CurrentUser;
import com.teamtaskmanager.task.TaskStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
	private final DashboardService dashboardService;

	public DashboardController(DashboardService dashboardService) {
		this.dashboardService = dashboardService;
	}

	@GetMapping
	public DashboardResponse get(
			@RequestParam(required = false) TaskStatus status,
			@RequestParam(required = false) Long projectId
	) {
		return dashboardService.get(CurrentUser.require(), status, projectId);
	}
}

